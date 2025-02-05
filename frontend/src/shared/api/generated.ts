/**
 * Generated by orval v6.27.1 🍺
 * Do not edit manually.
 * Car auction
 * OpenAPI spec version: 1.0.0
 */
import { createInstance } from "./api-instance";
import type { BodyType } from "./api-instance";
export type ProcessesControllerGetConversationsParams = {
  skip?: number;
  take?: number;
  process_type?: string;
};

export type DealersCarsControllerGetAllDealersCarsParams = {
  /**
   * Поиск автомобилей подходящих под параметры лота
   */
  lot_id?: string;
  only_filled?: boolean;
};

export type DealersCarsControllerCreateParams = {
  engine_hash?: string;
  complectation_id?: string;
};

export type OffersControllerGetOffersTemplatesParams = {
  lot_id?: string;
};

export type OffersControllerGetOffersParams = {
  lot_id: string;
};

export type LotsControllerGetLotOptionsByLotIdParams = {
  /**
   * обязательные/желательные опции
   */
  strict: boolean;
};

export type LotsControllerGetLotsByCarIdParams = {
  part?: string;
};

export type LotsControllerGetAllLotsParams = {
  /**
   * Поиск только тех лотов, где есть предложения, владельцем которых является пользователь(дилер)
   */
  involved?: boolean;
  mark_id?: string;
  model_id?: string;
  gen_id?: string;
  conf_id?: string;
  city_id?: string;
  status?: string;
  minPrice?: number;
  dealer_car_id?: number;
};

export type CitiesControllerGetCitiesParams = {
  name?: string;
};

export type CarCatalogControllerGetModificationByConfigurationParams = {
  /**
   * Группировать по hash engine
   */
  groupByEngine?: boolean;
};

export type CarCatalogControllerGetMarkWithModelsParams = {
  /**
   * Показать только данные бренда
   */
  onlyBrandData?: boolean;
};

export type CarCatalogControllerGetOptionsByEngineHashParams = {
  /**
   * ID комплектации(модификации) автомобиля
   */
  complectationId?: string;
  /**
   * не заполнено - все опции, default - только общие бесплатные для всех комплектаций, paid - только те, где хотя бы в 1 комплектации опция платная
   */
  part?: string;
};

export type CarCatalogControllerGetAllBrandsParams = {
  limit?: number;
  random?: boolean;
  popular?: boolean;
};

export interface CreateMessageDto {
  dealers_car_id: string;
  decision_id?: string;
  lot_id: string;
  message: string;
  offer_id: string;
  process_id: string;
  process_type: string;
}

export interface ProcessesDecisionsDto {
  id: string;
  name: string;
}

export interface MessageDto {
  author_id: string;
  author_name: string;
  createdAt: string;
  id: string;
  message: string;
  process_id: string;
}

export interface ProcessDto {
  dealers_car_id: string;
  decisions: ProcessesDecisionsDto[];
  id: string;
  is_decision_required: boolean;
  is_process_closed: boolean;
  lastMessage: MessageDto;
  lastMessageDate: string;
  lot_id: string;
  messages: MessageDto[];
  offer_id: string;
  process_type: string;
}

export interface DealersCarIdDto {
  id: string;
  sequence: number;
}

export interface DealersCarsPhotos {
  [key: string]: any;
}

export interface DealersCarOptionsAttrMap {
  [key: string]: any;
}

export interface PatchDealersCarDto {
  brand_id: string;
  city_id?: string;
  city_name?: string;
  complectation_id?: string;
  configuration_id: string;
  engine_hash: string;
  generation_id: string;
  id: string;
  isMileageAbroad: boolean;
  mileage?: number;
  model_id: string;
  options: DealersCarOptionsAttrMap[];
  photos: DealersCarsPhotos[];
  vin?: string;
  year?: number;
}

export interface OfferIdDto {
  id: string;
  lot_id: string;
}

/**
 * @nullable
 */
export type OfferDtoPriceValidTill = { [key: string]: any } | null;

export type OfferDtoMessage = { [key: string]: any };

export type OfferDtoCar = { [key: string]: any };

export interface OffersStatusDto {
  isLast: boolean;
  isVisibleForBuyer: boolean;
  name: string;
  name_cyrillic: string;
  timestamp: string;
}

export interface OfferOptionDto {
  accordance_type: string;
  combined_option_id: string;
  option_name: string;
  value: string;
}

export interface OfferDto {
  car: OfferDtoCar;
  created_at: string;
  dealer_rating: number;
  dealers_car_id: string;
  distance: number;
  id: string;
  is_own: boolean;
  isCreditAvailable: boolean;
  isInsuranceAvailable: boolean;
  isTradeinAvailable: boolean;
  lot_id: string;
  message: OfferDtoMessage;
  options: OfferOptionDto[];
  price: number;
  /** @nullable */
  priceValidTill: OfferDtoPriceValidTill;
  sequence: string;
  status: OffersStatusDto;
  waiting: number;
}

export interface OfferCreateDto {
  city_id: string;
  dealers_car: DealersCarDto;
  dealers_car_id: string;
  isCreditAvailable: boolean;
  isInsuranceAvailable: boolean;
  isTradeinAvailable: boolean;
  lot_id: string;
  options: OfferOptionDto[];
  price: number;
  /** @nullable */
  priceValidTill: string | null;
  waiting: number;
}

export interface DealersCarOptionDto {
  combined_option_id: string;
  dealer_car_id: string;
  is_complectation_option: boolean;
  option_name: string;
  value: string;
  value_type: string;
}

export interface LotStatusDto {
  isLast: boolean;
  name: string;
  timestamp: string;
}

export interface LotOptionDto {
  combined_option_id: string;
  option_name: string;
  strict: boolean;
  value: string;
}

export interface LotDto {
  brand: string;
  brand_logo: string;
  city: string;
  complectation: string;
  configuration: string;
  configuration_photo: string;
  created_at: string;
  engine_hash: string;
  is_own: boolean;
  lot_id: number;
  lot_uuid: string;
  max_distance: number;
  model: string;
  offers_count: number;
  offers_fit_options: number;
  offers_min_price: number;
  options: LotOptionDto[];
  own_offers_count: number;
  status: LotStatusDto;
}

export interface DealersCarDto {
  brand: string;
  brand_id: string;
  city: string;
  complectation: string;
  complectation_id: string;
  configuration: string;
  configuration_id: string;
  engine_hash: string;
  fittableLots: LotDto[];
  generation: string;
  generation_id: string;
  id: string;
  is_filled: boolean;
  is_own: boolean;
  is_verified: boolean;
  isMileageAbroad: boolean;
  lots: LotDto[];
  mileage: number;
  model: string;
  model_id: string;
  options: DealersCarOptionDto[];
  photo: string;
  sequence: number;
  status: string;
  vin: string;
  year: number;
}

export interface LotIdDto {
  lot_id: number;
  lot_uuid: string;
}

export interface LotsOptionsAttrMap {
  [key: string]: any;
}

export interface LotCreateDto {
  city_id: string;
  configuration_id: string;
  engine_hash: string;
  generation_id: string;
  mark_id: string;
  max_distance: number;
  model_id: string;
  options: LotsOptionsAttrMap[];
}

export interface CityDto {
  coords_lat: string;
  coords_lon: string;
  district: string;
  id: string;
  name: string;
  population: string;
  subject: string;
}

export interface MarkWithModelsDto {
  country: string;
  cyrillicName: string;
  groupSymbol: string;
  id: string;
  items: ModelDto[];
  logo: string;
  name: string;
  popular: boolean;
}

export interface OptionsAttrMapCategoryDictionaryDto {
  [key: string]: any;
}

export interface ComplectationWithOptionsDto {
  groupName: string;
  id: string;
  options: OptionsAttrMapCategoryDictionaryDto;
}

export interface SpecificationCategoryDictionaryDto {
  [key: string]: any;
}

export interface OptionsCategoryDictionaryDto {
  [key: string]: any;
}

export interface DetailedModificationDto {
  consumptionMixed: number;
  drive: string;
  engineType: string;
  groupName: string;
  horsePower: number;
  id: string;
  options: OptionsCategoryDictionaryDto;
  specifications: SpecificationCategoryDictionaryDto;
  timeTo100: number;
  transmission: string;
  volumeLitres: number;
}

export interface ModificationDto {
  consumptionCity: number;
  consumptionHiway: number;
  consumptionMixed: number;
  drive: string;
  engineHash: string;
  engineType: string;
  groupName: string;
  horsePower: number;
  id: string;
  timeTo100: number;
  transmission: string;
  volumeLitres: number;
}

export interface ConfigurationDto {
  bodyType: string;
  doorsCount: number;
  id: string;
  notice: string;
  photo: string;
}

export interface GenerationDto {
  configurations: ConfigurationDto[];
  id: string;
  isRestyle: boolean;
  name: string;
  yearStart: number;
  yearStop: number;
}

export interface ModelDto {
  class: string;
  cyrillicName: string;
  id: string;
  name: string;
  yearFrom: number;
  yearTo: number;
}

export interface MarkDto {
  country: string;
  cyrillicName: string;
  groupSymbol: string;
  id: string;
  logo: string;
  name: string;
  popular: boolean;
}

export interface BrandModelGenConfDto {
  brand: MarkDto;
  configuration: ConfigurationDto;
  generation: GenerationDto;
  model: ModelDto;
}

export interface GetSessionInfoDto {
  email: string;
  exp: number;
  iat: number;
  id: string;
  type: string;
}

export interface ChangePasswordBodyDto {
  newPassword: string;
  password: string;
}

export interface ResetPasswordBodyDto {
  email: string;
}

export interface EmailVerificationDto {
  code: string;
  email: string;
}

export interface EmailBodyDto {
  email: string;
}

export interface SignInBodyDto {
  email: string;
  password: string;
}

export interface SignUpSubAccountBodyDto {
  address: string;
  comment: string;
  email: string;
  name: string;
  password: string;
  phone: string;
}

export interface AuthResDto {
  email: string;
  isEmailVerified: boolean;
}

export interface SignUpBodyDto {
  email: string;
  password: string;
}

export interface SubAccountDto {
  address: string;
  comment: string;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  phone: string;
}

export interface PostAccountPhoneVerifyDto {
  code: string;
  phone?: string;
}

export interface PatchAccountPhoneDto {
  phone?: string;
}

export interface PatchAccountDto {
  address?: string;
  comment?: string;
  id?: string;
  name?: string;
  phone?: string;
}

export interface AccountDto {
  accountType: string;
  id: string;
  isPhoneVerified: boolean;
  lastname: string;
  name: string;
  ownerId: string;
  phone: string;
}

type SecondParameter<T extends (...args: any) => any> = Parameters<T>[1];

export const appControllerGetHello = (
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<void>({ url: `/v1`, method: "GET" }, options);
};

export const accountControllerGetAccount = (
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AccountDto>(
    { url: `/v1/account`, method: "GET" },
    options,
  );
};

export const accountControllerPatchAccount = (
  patchAccountDto: BodyType<PatchAccountDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AccountDto>(
    {
      url: `/v1/account`,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: patchAccountDto,
    },
    options,
  );
};

export const accountControllerPatchAccountPhone = (
  patchAccountPhoneDto: BodyType<PatchAccountPhoneDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AccountDto>(
    {
      url: `/v1/account/phone`,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: patchAccountPhoneDto,
    },
    options,
  );
};

export const accountControllerPostAccountPhoneVerify = (
  postAccountPhoneVerifyDto: BodyType<PostAccountPhoneVerifyDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AccountDto>(
    {
      url: `/v1/account/verify-phone`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: postAccountPhoneVerifyDto,
    },
    options,
  );
};

export const accountControllerGetSubAccounts = (
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<SubAccountDto[]>(
    { url: `/v1/account/sub-accounts`, method: "GET" },
    options,
  );
};

export const authControllerSignUp = (
  signUpBodyDto: BodyType<SignUpBodyDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AuthResDto>(
    {
      url: `/v1/auth/sign-up`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: signUpBodyDto,
    },
    options,
  );
};

export const authControllerSignUpSub = (
  signUpSubAccountBodyDto: BodyType<SignUpSubAccountBodyDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AuthResDto>(
    {
      url: `/v1/auth/sign-up-sub`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: signUpSubAccountBodyDto,
    },
    options,
  );
};

export const authControllerSignIn = (
  signInBodyDto: BodyType<SignInBodyDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AuthResDto>(
    {
      url: `/v1/auth/sign-in`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: signInBodyDto,
    },
    options,
  );
};

export const authControllerSignOut = (
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<void>(
    { url: `/v1/auth/sign-out`, method: "POST" },
    options,
  );
};

export const authControllerSendCode = (
  emailBodyDto: BodyType<EmailBodyDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AuthResDto>(
    {
      url: `/v1/auth/send-code`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: emailBodyDto,
    },
    options,
  );
};

export const authControllerEmailVerify = (
  emailVerificationDto: BodyType<EmailVerificationDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AuthResDto>(
    {
      url: `/v1/auth/verify-email`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: emailVerificationDto,
    },
    options,
  );
};

export const authControllerResetPassword = (
  resetPasswordBodyDto: BodyType<ResetPasswordBodyDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<void>(
    {
      url: `/v1/auth/reset-password`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: resetPasswordBodyDto,
    },
    options,
  );
};

export const authControllerChangePassword = (
  changePasswordBodyDto: BodyType<ChangePasswordBodyDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<AuthResDto>(
    {
      url: `/v1/auth/change-password`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: changePasswordBodyDto,
    },
    options,
  );
};

export const authControllerGetSessionInfo = (
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<GetSessionInfoDto>(
    { url: `/v1/auth/session`, method: "GET" },
    options,
  );
};

export const carCatalogControllerGetAllBrands = (
  params?: CarCatalogControllerGetAllBrandsParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<MarkDto[]>(
    { url: `/v1/car-catalog`, method: "GET", params },
    options,
  );
};

export const carCatalogControllerGetModelinfo = (
  modelId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<ModelDto>(
    { url: `/v1/car-catalog/model-info/${modelId}`, method: "GET" },
    options,
  );
};

export const carCatalogControllerGetConfigurationInfo = (
  generationIdConfigurationId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<GenerationDto>(
    {
      url: `/v1/car-catalog/configuration-info/${generationIdConfigurationId}`,
      method: "GET",
    },
    options,
  );
};

export const carCatalogControllerGetOptionsDictionary = (
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<void>(
    { url: `/v1/car-catalog/catalog-info/options_dict`, method: "GET" },
    options,
  );
};

export const carCatalogControllerGetBrandModelGenConfInfoByEngineHash = (
  engineHash: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<BrandModelGenConfDto>(
    { url: `/v1/car-catalog/catalog-info/${engineHash}`, method: "GET" },
    options,
  );
};

export const carCatalogControllerGetComplectationInfoByEngineHash = (
  engineHash: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<ModificationDto>(
    { url: `/v1/car-catalog/complectation-info/${engineHash}`, method: "GET" },
    options,
  );
};

export const carCatalogControllerGetComplectationSpecificationInfoByEngineHash =
  (engineHash: string, options?: SecondParameter<typeof createInstance>) => {
    return createInstance<DetailedModificationDto>(
      {
        url: `/v1/car-catalog/specification-info/${engineHash}`,
        method: "GET",
      },
      options,
    );
  };

export const carCatalogControllerGetOptionsByConfiguration = (
  modificationId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OptionsAttrMapCategoryDictionaryDto>(
    {
      url: `/v1/car-catalog/options-map/modificationId=${modificationId}`,
      method: "GET",
    },
    options,
  );
};

export const carCatalogControllerGetOptionsByEngineHash = (
  engineHash: string,
  params?: CarCatalogControllerGetOptionsByEngineHashParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OptionsAttrMapCategoryDictionaryDto>(
    {
      url: `/v1/car-catalog/options-map/engine=${engineHash}`,
      method: "GET",
      params,
    },
    options,
  );
};

export const carCatalogControllerGetComplectationNamesWithOptionsByEngineHash =
  (engineHash: string, options?: SecondParameter<typeof createInstance>) => {
    return createInstance<ComplectationWithOptionsDto[]>(
      {
        url: `/v1/car-catalog/complectations/engine=${engineHash}`,
        method: "GET",
      },
      options,
    );
  };

export const carCatalogControllerGetMarkWithModels = (
  markId: string,
  params?: CarCatalogControllerGetMarkWithModelsParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<MarkWithModelsDto>(
    { url: `/v1/car-catalog/${markId}`, method: "GET", params },
    options,
  );
};

export const carCatalogControllerGetGenerationsByModel = (
  markId: string,
  modelId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<GenerationDto[]>(
    { url: `/v1/car-catalog/${markId}/${modelId}`, method: "GET" },
    options,
  );
};

export const carCatalogControllerGetConfigurationsByGeneration = (
  markId: string,
  modelId: string,
  generationId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<ConfigurationDto[]>(
    {
      url: `/v1/car-catalog/${markId}/${modelId}/${generationId}`,
      method: "GET",
    },
    options,
  );
};

export const carCatalogControllerGetModificationByConfiguration = (
  markId: string,
  modelId: string,
  generationId: string,
  configurationId: string,
  params?: CarCatalogControllerGetModificationByConfigurationParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<ModificationDto[]>(
    {
      url: `/v1/car-catalog/${markId}/${modelId}/${generationId}/${configurationId}`,
      method: "GET",
      params,
    },
    options,
  );
};

export const carCatalogControllerGetDetailedModification = (
  markId: string,
  modelId: string,
  generationId: string,
  configurationId: string,
  modificationId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<DetailedModificationDto>(
    {
      url: `/v1/car-catalog/${markId}/${modelId}/${generationId}/${configurationId}/${modificationId}`,
      method: "GET",
    },
    options,
  );
};

export const citiesControllerGetCities = (
  params?: CitiesControllerGetCitiesParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<CityDto[]>(
    { url: `/v1/cities`, method: "GET", params },
    options,
  );
};

export const lotsControllerCreate = (
  lotCreateDto: BodyType<LotCreateDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<LotIdDto>(
    {
      url: `/v1/lots`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: lotCreateDto,
    },
    options,
  );
};

export const lotsControllerGetAllLots = (
  params?: LotsControllerGetAllLotsParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<LotDto[]>(
    { url: `/v1/lots`, method: "GET", params },
    options,
  );
};

export const lotsControllerGetLotsByCarId = (
  carId: string,
  params?: LotsControllerGetLotsByCarIdParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<LotDto[]>(
    { url: `/v1/lots/by_car_id/${carId}`, method: "GET", params },
    options,
  );
};

export const lotsControllerGetLotById = (
  lotId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<LotDto>(
    { url: `/v1/lots/${lotId}`, method: "GET" },
    options,
  );
};

export const lotsControllerGetLotOptionsByLotId = (
  lotId: string,
  params: LotsControllerGetLotOptionsByLotIdParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OptionsCategoryDictionaryDto[]>(
    { url: `/v1/lots/${lotId}/options`, method: "GET", params },
    options,
  );
};

export const offersControllerCreate = (
  offerCreateDto: BodyType<OfferCreateDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OfferDto>(
    {
      url: `/v1/offers`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: offerCreateDto,
    },
    options,
  );
};

export const offersControllerGetOffers = (
  params: OffersControllerGetOffersParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OfferDto[]>(
    { url: `/v1/offers`, method: "GET", params },
    options,
  );
};

export const offersControllerGetOffersTemplates = (
  params?: OffersControllerGetOffersTemplatesParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OfferCreateDto[]>(
    { url: `/v1/offers/create`, method: "GET", params },
    options,
  );
};

export const offersControllerGetOfferById = (
  offerId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OfferDto>(
    { url: `/v1/offers/${offerId}`, method: "GET" },
    options,
  );
};

export const offersControllerDeleteOfferById = (
  offerId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OfferIdDto>(
    { url: `/v1/offers/${offerId}`, method: "DELETE" },
    options,
  );
};

export const offersControllerSetOfferStatus = (
  offerId: string,
  statusDirection: "prev" | "next",
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OfferDto>(
    { url: `/v1/offers/${offerId}/${statusDirection}`, method: "POST" },
    options,
  );
};

export const offersControllerDeleteOffersByCarId = (
  carId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<void>(
    { url: `/v1/offers/by_car_id/${carId}`, method: "DELETE" },
    options,
  );
};

export const offersControllerGetMostImportantStatusByCarId = (
  carId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OffersStatusDto>(
    { url: `/v1/offers/status_by_car/${carId}`, method: "GET" },
    options,
  );
};

export const dealersCarsControllerCreate = (
  patchDealersCarDto: BodyType<PatchDealersCarDto>,
  params?: DealersCarsControllerCreateParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<PatchDealersCarDto>(
    {
      url: `/v1/dealers-cars`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: patchDealersCarDto,
      params,
    },
    options,
  );
};

export const dealersCarsControllerGetAllDealersCars = (
  params?: DealersCarsControllerGetAllDealersCarsParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<DealersCarDto[]>(
    { url: `/v1/dealers-cars`, method: "GET", params },
    options,
  );
};

export const dealersCarsControllerPatchDealersCars = (
  patchDealersCarDto: BodyType<PatchDealersCarDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<PatchDealersCarDto>(
    {
      url: `/v1/dealers-cars`,
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      data: patchDealersCarDto,
    },
    options,
  );
};

export const dealersCarsControllerGetDealersCarById = (
  carId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<DealersCarDto>(
    { url: `/v1/dealers-cars/${carId}`, method: "GET" },
    options,
  );
};

export const dealersCarsControllerDeleteDealersCar = (
  carId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<DealersCarIdDto>(
    { url: `/v1/dealers-cars/${carId}`, method: "DELETE" },
    options,
  );
};

export const dealersCarsControllerGetDealersCarMappedOptionsByCarId = (
  carId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<OptionsCategoryDictionaryDto>(
    { url: `/v1/dealers-cars/${carId}/options`, method: "GET" },
    options,
  );
};

export const dealersCarsControllerGetDealersCarPatchInfoById = (
  carId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<PatchDealersCarDto>(
    { url: `/v1/dealers-cars/patch_info/${carId}`, method: "GET" },
    options,
  );
};

export const processesControllerGetConversations = (
  params?: ProcessesControllerGetConversationsParams,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<ProcessDto[]>(
    { url: `/v1/processes`, method: "GET", params },
    options,
  );
};

export const processesControllerCreateMessage = (
  createMessageDto: BodyType<CreateMessageDto>,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<MessageDto>(
    {
      url: `/v1/processes`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: createMessageDto,
    },
    options,
  );
};

export const processesControllerGetProcess = (
  processId: string,
  options?: SecondParameter<typeof createInstance>,
) => {
  return createInstance<ProcessDto>(
    { url: `/v1/processes/${processId}`, method: "GET" },
    options,
  );
};

export type AppControllerGetHelloResult = NonNullable<
  Awaited<ReturnType<typeof appControllerGetHello>>
>;
export type AccountControllerGetAccountResult = NonNullable<
  Awaited<ReturnType<typeof accountControllerGetAccount>>
>;
export type AccountControllerPatchAccountResult = NonNullable<
  Awaited<ReturnType<typeof accountControllerPatchAccount>>
>;
export type AccountControllerPatchAccountPhoneResult = NonNullable<
  Awaited<ReturnType<typeof accountControllerPatchAccountPhone>>
>;
export type AccountControllerPostAccountPhoneVerifyResult = NonNullable<
  Awaited<ReturnType<typeof accountControllerPostAccountPhoneVerify>>
>;
export type AccountControllerGetSubAccountsResult = NonNullable<
  Awaited<ReturnType<typeof accountControllerGetSubAccounts>>
>;
export type AuthControllerSignUpResult = NonNullable<
  Awaited<ReturnType<typeof authControllerSignUp>>
>;
export type AuthControllerSignUpSubResult = NonNullable<
  Awaited<ReturnType<typeof authControllerSignUpSub>>
>;
export type AuthControllerSignInResult = NonNullable<
  Awaited<ReturnType<typeof authControllerSignIn>>
>;
export type AuthControllerSignOutResult = NonNullable<
  Awaited<ReturnType<typeof authControllerSignOut>>
>;
export type AuthControllerSendCodeResult = NonNullable<
  Awaited<ReturnType<typeof authControllerSendCode>>
>;
export type AuthControllerEmailVerifyResult = NonNullable<
  Awaited<ReturnType<typeof authControllerEmailVerify>>
>;
export type AuthControllerResetPasswordResult = NonNullable<
  Awaited<ReturnType<typeof authControllerResetPassword>>
>;
export type AuthControllerChangePasswordResult = NonNullable<
  Awaited<ReturnType<typeof authControllerChangePassword>>
>;
export type AuthControllerGetSessionInfoResult = NonNullable<
  Awaited<ReturnType<typeof authControllerGetSessionInfo>>
>;
export type CarCatalogControllerGetAllBrandsResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetAllBrands>>
>;
export type CarCatalogControllerGetModelinfoResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetModelinfo>>
>;
export type CarCatalogControllerGetConfigurationInfoResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetConfigurationInfo>>
>;
export type CarCatalogControllerGetOptionsDictionaryResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetOptionsDictionary>>
>;
export type CarCatalogControllerGetBrandModelGenConfInfoByEngineHashResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof carCatalogControllerGetBrandModelGenConfInfoByEngineHash
      >
    >
  >;
export type CarCatalogControllerGetComplectationInfoByEngineHashResult =
  NonNullable<
    Awaited<
      ReturnType<typeof carCatalogControllerGetComplectationInfoByEngineHash>
    >
  >;
export type CarCatalogControllerGetComplectationSpecificationInfoByEngineHashResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof carCatalogControllerGetComplectationSpecificationInfoByEngineHash
      >
    >
  >;
export type CarCatalogControllerGetOptionsByConfigurationResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetOptionsByConfiguration>>
>;
export type CarCatalogControllerGetOptionsByEngineHashResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetOptionsByEngineHash>>
>;
export type CarCatalogControllerGetComplectationNamesWithOptionsByEngineHashResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof carCatalogControllerGetComplectationNamesWithOptionsByEngineHash
      >
    >
  >;
export type CarCatalogControllerGetMarkWithModelsResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetMarkWithModels>>
>;
export type CarCatalogControllerGetGenerationsByModelResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetGenerationsByModel>>
>;
export type CarCatalogControllerGetConfigurationsByGenerationResult =
  NonNullable<
    Awaited<
      ReturnType<typeof carCatalogControllerGetConfigurationsByGeneration>
    >
  >;
export type CarCatalogControllerGetModificationByConfigurationResult =
  NonNullable<
    Awaited<
      ReturnType<typeof carCatalogControllerGetModificationByConfiguration>
    >
  >;
export type CarCatalogControllerGetDetailedModificationResult = NonNullable<
  Awaited<ReturnType<typeof carCatalogControllerGetDetailedModification>>
>;
export type CitiesControllerGetCitiesResult = NonNullable<
  Awaited<ReturnType<typeof citiesControllerGetCities>>
>;
export type LotsControllerCreateResult = NonNullable<
  Awaited<ReturnType<typeof lotsControllerCreate>>
>;
export type LotsControllerGetAllLotsResult = NonNullable<
  Awaited<ReturnType<typeof lotsControllerGetAllLots>>
>;
export type LotsControllerGetLotsByCarIdResult = NonNullable<
  Awaited<ReturnType<typeof lotsControllerGetLotsByCarId>>
>;
export type LotsControllerGetLotByIdResult = NonNullable<
  Awaited<ReturnType<typeof lotsControllerGetLotById>>
>;
export type LotsControllerGetLotOptionsByLotIdResult = NonNullable<
  Awaited<ReturnType<typeof lotsControllerGetLotOptionsByLotId>>
>;
export type OffersControllerCreateResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerCreate>>
>;
export type OffersControllerGetOffersResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerGetOffers>>
>;
export type OffersControllerGetOffersTemplatesResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerGetOffersTemplates>>
>;
export type OffersControllerGetOfferByIdResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerGetOfferById>>
>;
export type OffersControllerDeleteOfferByIdResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerDeleteOfferById>>
>;
export type OffersControllerSetOfferStatusResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerSetOfferStatus>>
>;
export type OffersControllerDeleteOffersByCarIdResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerDeleteOffersByCarId>>
>;
export type OffersControllerGetMostImportantStatusByCarIdResult = NonNullable<
  Awaited<ReturnType<typeof offersControllerGetMostImportantStatusByCarId>>
>;
export type DealersCarsControllerCreateResult = NonNullable<
  Awaited<ReturnType<typeof dealersCarsControllerCreate>>
>;
export type DealersCarsControllerGetAllDealersCarsResult = NonNullable<
  Awaited<ReturnType<typeof dealersCarsControllerGetAllDealersCars>>
>;
export type DealersCarsControllerPatchDealersCarsResult = NonNullable<
  Awaited<ReturnType<typeof dealersCarsControllerPatchDealersCars>>
>;
export type DealersCarsControllerGetDealersCarByIdResult = NonNullable<
  Awaited<ReturnType<typeof dealersCarsControllerGetDealersCarById>>
>;
export type DealersCarsControllerDeleteDealersCarResult = NonNullable<
  Awaited<ReturnType<typeof dealersCarsControllerDeleteDealersCar>>
>;
export type DealersCarsControllerGetDealersCarMappedOptionsByCarIdResult =
  NonNullable<
    Awaited<
      ReturnType<typeof dealersCarsControllerGetDealersCarMappedOptionsByCarId>
    >
  >;
export type DealersCarsControllerGetDealersCarPatchInfoByIdResult = NonNullable<
  Awaited<ReturnType<typeof dealersCarsControllerGetDealersCarPatchInfoById>>
>;
export type ProcessesControllerGetConversationsResult = NonNullable<
  Awaited<ReturnType<typeof processesControllerGetConversations>>
>;
export type ProcessesControllerCreateMessageResult = NonNullable<
  Awaited<ReturnType<typeof processesControllerCreateMessage>>
>;
export type ProcessesControllerGetProcessResult = NonNullable<
  Awaited<ReturnType<typeof processesControllerGetProcess>>
>;
