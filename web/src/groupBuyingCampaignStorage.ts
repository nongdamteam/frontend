import {
  groupBuyingCampaignStorageKey,
  type GroupBuyingCampaign,
  type GroupBuyingStatus,
} from './productRegistrationConfig'

const groupBuyingStatuses: GroupBuyingStatus[] = [
  '모집중',
  '마감임박',
  '성사',
  '목표미달',
  '배송준비',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isGroupBuyingStatus(value: unknown): value is GroupBuyingStatus {
  return (
    typeof value === 'string' &&
    groupBuyingStatuses.includes(value as GroupBuyingStatus)
  )
}

function isGroupBuyingCampaign(value: unknown): value is GroupBuyingCampaign {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    (value.source === 'mock' || value.source === 'saved') &&
    isGroupBuyingStatus(value.status) &&
    typeof value.productName === 'string' &&
    typeof value.category === 'string' &&
    typeof value.origin === 'string' &&
    typeof value.producerName === 'string' &&
    Array.isArray(value.certificationMarkIds) &&
    typeof value.regularPrice === 'number' &&
    typeof value.groupBuyingPrice === 'number' &&
    typeof value.surplusQuantity === 'number' &&
    typeof value.portionUnit === 'string' &&
    typeof value.minimumOrderQuantity === 'number' &&
    typeof value.maximumOrderQuantity === 'number' &&
    typeof value.currentOrderQuantity === 'number' &&
    typeof value.orderCount === 'number' &&
    typeof value.recruitEndDate === 'string' &&
    typeof value.groupShippingDate === 'string' &&
    typeof value.purchaseLimit === 'number' &&
    typeof value.failurePolicy === 'string' &&
    typeof value.deliveryMethod === 'string' &&
    typeof value.deliveryFee === 'number' &&
    typeof value.createdAt === 'string'
  )
}

function removeVolatileThumbnail(campaign: GroupBuyingCampaign) {
  return {
    ...campaign,
    thumbnail: undefined,
  }
}

export function readStoredGroupBuyingCampaigns(): GroupBuyingCampaign[] {
  try {
    const savedCampaigns = localStorage.getItem(groupBuyingCampaignStorageKey)
    if (!savedCampaigns) {
      return []
    }

    const parsedCampaigns: unknown = JSON.parse(savedCampaigns)
    if (!Array.isArray(parsedCampaigns)) {
      return []
    }

    return parsedCampaigns.filter(isGroupBuyingCampaign)
  } catch {
    return []
  }
}

export function saveStoredGroupBuyingCampaigns(
  campaigns: GroupBuyingCampaign[],
) {
  localStorage.setItem(
    groupBuyingCampaignStorageKey,
    JSON.stringify(campaigns.map(removeVolatileThumbnail)),
  )
}

export function prependStoredGroupBuyingCampaign(
  campaign: GroupBuyingCampaign,
) {
  const nextCampaigns = [campaign, ...readStoredGroupBuyingCampaigns()]
  saveStoredGroupBuyingCampaigns(nextCampaigns)

  return nextCampaigns
}
