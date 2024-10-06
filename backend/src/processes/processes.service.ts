import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { GetSessionInfoDto } from 'src/auth/dto';
import { ProcessDto, MessageDto } from './dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ProcessesProvider } from './providers/processes.provider';
import { ProcessesTypesProvider } from './providers/processes_types.provider';
import { ProcessesMessagesProvider } from './providers/processes_messages.provider';
import { ProcessesDecisionsProvider } from './providers/processes_decisions.provider';
import { OffersStatusesProvider } from 'src/offers/providers/offers_statuses.provider';

@Injectable()
export class ProcessesService {

    private readonly logger: Logger;
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly winstonLogger: Logger,

        private processesProvider: ProcessesProvider,
        private processesTypesProvider: ProcessesTypesProvider,
        private processesMessagesProvider: ProcessesMessagesProvider,
        private processesDecisionsProvider: ProcessesDecisionsProvider,

        private offersStatusesProvider: OffersStatusesProvider
    ) {
        this.logger = winstonLogger.child({ service: ProcessesService.name });
    }

    async createMessage(session: GetSessionInfoDto, processTypeName: string, message: string, processId?: string, lotId?: string, offerId?: string, dealersCarId?: string, decisionId?: string) {
        const processType = await this.processesTypesProvider.get(processTypeName);
        let messageText = message;
        let process: any;
        if (processId) {
            if (session.type === "service_desk" || session.type === "root") {
                process = await this.processesProvider.getById(session, processId);
            } else {
                process = await this.processesProvider.getOwnById(session, processId);
            }
        } else {
            process = await this.processesProvider.getByType(session, processType);
        }

        if (!process || process.is_process_closed) {
            process = await this.processesProvider.create(session, { processType, lotId, offerId, dealersCarId });
        }

        if (decisionId && process.is_decision_required) {
            if (session.type !== "service_desk" && session.type !== "root") {
                throw new ForbiddenException();
            }
            const decision = await this.processesDecisionsProvider.get(decisionId);
            if (!decision) {
                throw new BadRequestException('Решение не найдено');
            }
            if (decision.name === 'accept') {
                if (offerId) {
                    await this.offersStatusesProvider.create(session.id, offerId, "published");
                    messageText = "Автомобиль прошёл верификацию, ваше предложение опубликовано";
                }
            }
            if (decision.name === 'reject') {

                if (offerId) {
                    await this.offersStatusesProvider.create(session.id, offerId, "finished");
                    messageText = "Автомобиль не прошёл верификацию, ваше предложение завершено";
                }
            }
            this.processesProvider.update(session, process.id, { decisionId });
        }
        const newMessage = await this.processesMessagesProvider.create(session, process.id, messageText);
        return new MessageDto(newMessage)
    }

    async getProcesses(session: GetSessionInfoDto, skip: number, take: number = 10, processType?: string): Promise<ProcessDto[]> {
        let processes: any[] = []
        switch (session.type) {
            case "root":
            case "service_desk":
                processes = await this.processesProvider.getProcessesForServiceDesk(session, skip, take, processType)
                break;
            case "customer":
            case "seller":
                processes = await this.processesProvider.getProcessesForUser(session, skip, take, processType)
                break;
        }

        const processesWithLastMessage = await Promise.all(processes.map(async (process) => {
            const lastMessages = await this.processesMessagesProvider.getLastMessages(session, process.id, 1);
            return {
                ...process,
                lastMessage: lastMessages[0]
            };
        }));
        return processesWithLastMessage.map(process => new ProcessDto(process))
    }

    async getProcessById(session: GetSessionInfoDto, processId: string) {

        const process = await this.processesProvider.getById(session, processId)

        if (process?.customer_id !== session.id && (session.type !== "service_desk" && session.type !== "root")) {
            throw new ForbiddenException()
        }

        const decisions = await this.processesDecisionsProvider.getAll();
        const messages = await this.processesMessagesProvider.getMessages(session, processId)
        return new ProcessDto(process, messages, decisions)
    }

}
