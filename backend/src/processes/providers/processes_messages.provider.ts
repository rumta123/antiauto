import { InjectRepository } from "@nestjs/typeorm";
import { ProcessesMessages } from "../entities/processes_messages.entity";
import { Repository } from "typeorm";
import { GetSessionInfoDto } from "src/auth/dto";

export class ProcessesMessagesProvider {
    
    constructor(
        @InjectRepository(ProcessesMessages)
        private readonly processesMessagesRepository: Repository<ProcessesMessages>
    ) { }

    async create(session: GetSessionInfoDto, processId: string, message: string) {
        const newMessage = this.processesMessagesRepository.create({
            process_id: processId,
            message,
            author: { id: session.id },
            createdBy: session.id
        })
        await this.processesMessagesRepository.save(newMessage)
        return newMessage
    }

    async getLastMessages(session: GetSessionInfoDto, processId: string, take: number) {
        return await this.processesMessagesRepository.find({
            where: {
                process_id: processId
            },
            relations: {
                author: {
                    account: true
                }
            },
            skip: 0,
            take: take,
            order: {
                createdAt: "DESC"
            }
        })
    }

    async getMessages(session: GetSessionInfoDto, processId: string) {
        return this.processesMessagesRepository.find({
            where: {
                process_id: processId
            },
            relations: {
                author: {
                    account: true
                }
            },
            order: {
                createdAt: "DESC"
            }
        })
    }
}

