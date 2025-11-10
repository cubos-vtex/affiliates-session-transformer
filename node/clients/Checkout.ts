import { AuthenticatedJanusClient } from './utils/AuthenticatedJanusClient'

type CustomDataArgs = {
  orderFormId: string
  appId: string
  appFieldName: string
  value?: unknown
}

type OrderFormConfiguration = {
  paymentConfiguration: {
    requiresAuthenticationForPreAuthorizedPaymentOption: boolean
    allowInstallmentsMerge: boolean | null
    blockPaymentSession: boolean | null
    paymentSystemToCheckFirstInstallment: string | null
    defaultPaymentSystemToApplyOnUserOrderForm: string | null
    alwaysShowMarketplacePaymentSystems: boolean
  }

  taxConfiguration: {
    url: string | null
    authorizationHeader: string | null
    appId: string
    isMarketplaceResponsibleForTaxes: boolean
  } | null

  minimumQuantityAccumulatedForItems: number
  decimalDigitsPrecision: number
  minimumValueAccumulated: number | null

  apps: Array<{
    id: string
    fields: string[]
    major: number
  }>

  allowMultipleDeliveries: boolean | null
  allowManualPrice: boolean | null
  savePersonalDataAsOptIn: boolean | null
  maxNumberOfWhiteLabelSellers: number | null
  maskFirstPurchaseData?: boolean | null
  maskStateOnAddress: boolean | null
  recaptchaValidation: 'never' | 'always' | 'vtexcriteria' | 'vtexCriteria'
  recaptchaMinScore: number | null
  recaptchaKeys: {
    publicKey?: string | null
    privateKey?: string | null
  } | null
  additionalRoutingSellersIds: string[]
  useOwnershipCookie: boolean | null
  ignoreProfileData: boolean | null
  useIndividualShippingEstimates: boolean | null
  allowMultipleCoupons: boolean | null
}

const ORDER_FORM_CONFIGURATION_ROUTE =
  '/api/checkout/pvt/configuration/orderForm'

export class Checkout extends AuthenticatedJanusClient {
  private getCustomDataRoute(args: CustomDataArgs) {
    const { orderFormId, appId, appFieldName } = args

    return `/api/checkout/pub/orderForm/${orderFormId}/customData/${appId}/${appFieldName}`
  }

  public async setCustomData({ value, ...args }: CustomDataArgs) {
    return this.http.put(this.getCustomDataRoute(args), { value })
  }

  public async deleteCustomData(args: CustomDataArgs) {
    return this.http.delete(this.getCustomDataRoute(args))
  }

  public async getOrderFormConfiguration() {
    return this.http.get<OrderFormConfiguration>(
      ORDER_FORM_CONFIGURATION_ROUTE,
      {
        headers: { VtexIdclientAutCookie: this.context.authToken },
      }
    )
  }

  public async updateOrderFormConfiguration(
    orderFormConfig: OrderFormConfiguration
  ) {
    return this.http.post(ORDER_FORM_CONFIGURATION_ROUTE, orderFormConfig, {
      headers: { VtexIdclientAutCookie: this.context.authToken },
    })
  }
}
