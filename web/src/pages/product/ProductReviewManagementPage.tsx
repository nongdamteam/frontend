import { useEffect, useMemo, useState } from 'react'
import { PartnerShell } from '../../components/layout/PartnerShell'
import type { AppView } from '../../app/appTypes'
import { getProductById } from '../../services/mockDb/commerceDummyData'

type ProductReviewManagementPageProps = {
  productId: number
  onNavigate?: (view: AppView) => void
}

type ReviewTopic =
  | '신선도'
  | '맛'
  | '크기/중량'
  | '가격 만족도'
  | '포장 상태'
  | '배송 속도'
  | '상품 설명 일치'
  | '재구매 의사'
  | '레시피 활용'

type ReviewRow = {
  id: number
  author: string
  rating: number
  content: string
  createdAt: string
  reply: string
}

type InquiryRow = {
  id: number
  author: string
  question: string
  createdAt: string
  answer: string
}

type TopicScore = {
  topic: ReviewTopic
  positive: number
  neutral: number
  negative: number
}

const REVIEW_SEED: ReviewRow[] = [
  {
    id: 1,
    author: '한*영',
    rating: 5,
    content:
      '배송이 빠르고 상태가 좋아요. 단단하고 달아서 겉절이, 전골에 모두 잘 맞았습니다. 다음에도 재구매할게요.',
    createdAt: '2026-05-28',
    reply: '',
  },
  {
    id: 2,
    author: '김*민',
    rating: 4,
    content: '신선도는 높은데 포장 테이프가 약해서 박스가 조금 벌어졌습니다. 내용물 손상은 없었습니다.',
    createdAt: '2026-05-27',
    reply: '',
  },
  {
    id: 3,
    author: '이*우',
    rating: 5,
    content: '국에 넣어 먹었더니 단맛이 좋아요. 양이 넉넉하고 사진이랑 실물이 거의 같습니다.',
    createdAt: '2026-05-25',
    reply: '',
  },
  {
    id: 4,
    author: '박*라',
    rating: 3,
    content: '맛은 괜찮지만 크기가 조금 들쭉날쭉했습니다. 다만 배송은 빠르고 신선도는 좋았습니다.',
    createdAt: '2026-05-24',
    reply: '',
  },
]

const INQUIRY_SEED: InquiryRow[] = [
  {
    id: 1,
    author: '문의자A',
    question: '1kg, 2kg 옵션별 포기 수가 대략 어떻게 되나요?',
    createdAt: '2026-05-27',
    answer: '',
  },
  {
    id: 2,
    author: '문의자B',
    question: '오늘 주문하면 수도권 내일 도착 가능한가요?',
    createdAt: '2026-05-26',
    answer: '',
  },
  {
    id: 3,
    author: '문의자C',
    question: '김치용으로 단단한 편인지 궁금합니다.',
    createdAt: '2026-05-24',
    answer: '',
  },
]

const REVIEW_ADMIN_STORAGE_KEY = 'nongdam-review-admin-replies-v1'

const REVIEW_TOPIC_MAP: Array<{ topic: ReviewTopic; keywords: string[] }> = [
  { topic: '신선도', keywords: ['신선', '무름', '변색', '상태'] },
  { topic: '맛', keywords: ['맛', '단맛', '식감', '향'] },
  { topic: '크기/중량', keywords: ['크기', '중량', '양', '포기'] },
  { topic: '가격 만족도', keywords: ['가격', '가성비', '비싸', '저렴'] },
  { topic: '포장 상태', keywords: ['포장', '박스', '테이프', '눌림', '파손'] },
  { topic: '배송 속도', keywords: ['배송', '도착', '지연', '빠르'] },
  { topic: '상품 설명 일치', keywords: ['설명', '사진', '실물', '같습니다'] },
  { topic: '재구매 의사', keywords: ['재구매', '다음에도', '또 주문'] },
  { topic: '레시피 활용', keywords: ['겉절이', '국', '전골', '조리', '요리'] },
]

function ratingToText(rating: number) {
  return `★`.repeat(rating) + `☆`.repeat(Math.max(0, 5 - rating))
}

function getSentimentByRating(rating: number) {
  if (rating >= 4) return 'positive'
  if (rating === 3) return 'neutral'
  return 'negative'
}

function scoreToActionPriority(score: TopicScore) {
  if (score.negative >= 2) return '높음'
  if (score.negative >= 1) return '중간'
  return '낮음'
}

export function ProductReviewManagementPage({ productId, onNavigate }: ProductReviewManagementPageProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [reviews, setReviews] = useState<ReviewRow[]>(REVIEW_SEED)
  const [inquiries, setInquiries] = useState<InquiryRow[]>(INQUIRY_SEED)
  const [summaryReady, setSummaryReady] = useState(false)
  const [reportReady, setReportReady] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [openReviewReplyId, setOpenReviewReplyId] = useState<number | null>(null)
  const [openInquiryReplyId, setOpenInquiryReplyId] = useState<number | null>(null)
  const [reviewReplyDrafts, setReviewReplyDrafts] = useState<Record<number, string>>({})
  const [inquiryAnswerDrafts, setInquiryAnswerDrafts] = useState<Record<number, string>>({})
  const [isHydrated, setIsHydrated] = useState(false)
  const [statusMessage, setStatusMessage] = useState('리뷰와 문의를 확인한 뒤 답변을 등록하세요.')

  const product = getProductById(productId)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const raw = localStorage.getItem(REVIEW_ADMIN_STORAGE_KEY)
      if (!raw) {
        setReviews(REVIEW_SEED)
        setInquiries(INQUIRY_SEED)
        setIsHydrated(true)
        return
      }

      const parsed = JSON.parse(raw) as Record<
        string,
        {
          reviews?: ReviewRow[]
          inquiries?: InquiryRow[]
        }
      >

      const saved = parsed[String(productId)]
      setReviews(saved?.reviews?.length ? saved.reviews : REVIEW_SEED)
      setInquiries(saved?.inquiries?.length ? saved.inquiries : INQUIRY_SEED)
      setIsHydrated(true)
    } catch {
      setReviews(REVIEW_SEED)
      setInquiries(INQUIRY_SEED)
      setIsHydrated(true)
    }
  }, [productId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isHydrated) return

    try {
      const raw = localStorage.getItem(REVIEW_ADMIN_STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}
      const next = {
        ...parsed,
        [String(productId)]: { reviews, inquiries },
      }
      localStorage.setItem(REVIEW_ADMIN_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // no-op
    }
  }, [isHydrated, productId, reviews, inquiries])

  const reviewSummary = useMemo(() => {
    if (reviews.length === 0) {
      return { average: 0, positiveRatio: 0, neutralRatio: 0, negativeRatio: 0 }
    }
    const totalRating = reviews.reduce((sum, row) => sum + row.rating, 0)
    const positiveCount = reviews.filter((row) => row.rating >= 4).length
    const neutralCount = reviews.filter((row) => row.rating === 3).length
    const negativeCount = reviews.length - positiveCount - neutralCount
    return {
      average: Number((totalRating / reviews.length).toFixed(1)),
      positiveRatio: Math.round((positiveCount / reviews.length) * 100),
      neutralRatio: Math.round((neutralCount / reviews.length) * 100),
      negativeRatio: Math.round((negativeCount / reviews.length) * 100),
    }
  }, [reviews])

  const topicScores = useMemo<TopicScore[]>(() => {
    const seed = REVIEW_TOPIC_MAP.map((item) => ({
      topic: item.topic,
      positive: 0,
      neutral: 0,
      negative: 0,
    }))

    reviews.forEach((review) => {
      const lower = review.content.toLowerCase()
      const sentiment = getSentimentByRating(review.rating)
      REVIEW_TOPIC_MAP.forEach((topicItem, index) => {
        const matched = topicItem.keywords.some((keyword) => lower.includes(keyword.toLowerCase()))
        if (!matched) return
        if (sentiment === 'positive') seed[index].positive += 1
        if (sentiment === 'neutral') seed[index].neutral += 1
        if (sentiment === 'negative') seed[index].negative += 1
      })
    })

    return seed
  }, [reviews])

  const topPositiveTopic = useMemo(
    () =>
      [...topicScores]
        .sort((a, b) => b.positive - a.positive)
        .find((item) => item.positive > 0),
    [topicScores],
  )

  const topRiskTopic = useMemo(
    () =>
      [...topicScores]
        .sort((a, b) => b.negative - a.negative)
        .find((item) => item.negative > 0),
    [topicScores],
  )

  const buyerSummaryText = useMemo(() => {
    if (!summaryReady) return ''

    const ratioLine = `최근 ${reviews.length}건의 리뷰 분석 결과, 긍정 ${reviewSummary.positiveRatio}% · 중립 ${reviewSummary.neutralRatio}% · 부정 ${reviewSummary.negativeRatio}% 입니다.`

    const detailLine = topRiskTopic
      ? `최근 리뷰에서는 ${topPositiveTopic?.topic ?? '전반 품질'}에 대한 만족도가 높습니다. 다만 일부 사용자는 ${topRiskTopic.topic} 관련 아쉬움을 남겼습니다.`
      : `최근 리뷰에서는 ${topPositiveTopic?.topic ?? '전반 품질'}에 대한 만족도가 높고, 뚜렷한 부정 이슈는 크지 않습니다.`

    return `${ratioLine} ${detailLine}`
  }, [summaryReady, reviews.length, reviewSummary, topPositiveTopic, topRiskTopic])

  const sellerReportLines = useMemo(() => {
    if (!reportReady) return []
    const riskItems = topicScores.filter((item) => item.negative > 0).sort((a, b) => b.negative - a.negative)
    if (riskItems.length === 0) {
      return ['현재 반복 불만 이슈가 크지 않아 운영 기준을 유지해도 됩니다.']
    }
    return riskItems.slice(0, 3).map((item) => {
      if (item.topic === '포장 상태') {
        return `포장 관련 불만 ${item.negative}건: 박스 테이핑 1회 추가, 완충재 보강, 출고 체크리스트에 포장 강도 항목을 반영하세요.`
      }
      if (item.topic === '크기/중량') {
        return `구성/중량 불만 ${item.negative}건: 옵션별 실제 구성(포기 수, 편차)을 상세 설명/이미지로 보완하세요.`
      }
      if (item.topic === '배송 속도') {
        return `배송 속도 불만 ${item.negative}건: 출고 마감시간과 도착 예상일 고정 문구를 노출해 기대치를 맞추세요.`
      }
      return `${item.topic} 관련 불만 ${item.negative}건: 운영 문구와 출고 프로세스를 점검해 개선안을 적용하세요.`
    })
  }, [reportReady, topicScores])

  const runAiSummary = () => {
    if (summaryLoading) return
    setSummaryLoading(true)
    setStatusMessage('리뷰를 분석하고 있어요...')
    window.setTimeout(() => {
      setSummaryLoading(false)
      setSummaryReady(true)
      setStatusMessage('리뷰 분석이 끝났어요.')
    }, 1100)
  }

  const publishImprovementReport = () => {
    if (reportLoading) return
    setReportLoading(true)
    setStatusMessage('개선 리포트를 만들고 있어요...')
    window.setTimeout(() => {
      setReportLoading(false)
      setReportReady(true)
      setStatusMessage('개선 리포트를 만들었어요.')
    }, 1300)
  }

  const updateReviewReplyDraft = (reviewId: number, reply: string) => {
    setReviewReplyDrafts((current) => ({ ...current, [reviewId]: reply }))
  }

  const openReviewReplyEditor = (reviewId: number) => {
    const target = reviews.find((row) => row.id === reviewId)
    setReviewReplyDrafts((current) => ({ ...current, [reviewId]: current[reviewId] ?? target?.reply ?? '' }))
    setOpenReviewReplyId(reviewId)
  }

  const cancelReviewReply = (reviewId: number) => {
    const target = reviews.find((row) => row.id === reviewId)
    setReviewReplyDrafts((current) => ({ ...current, [reviewId]: target?.reply ?? '' }))
    setOpenReviewReplyId(null)
  }

  const submitReviewReply = (reviewId: number) => {
    const draft = (reviewReplyDrafts[reviewId] ?? '').trim()
    if (!draft) {
      setStatusMessage('리뷰 답변 내용을 입력하세요.')
      return
    }
    setReviews((current) => current.map((row) => (row.id === reviewId ? { ...row, reply: draft } : row)))
    setReviewReplyDrafts((current) => ({ ...current, [reviewId]: draft }))
    setOpenReviewReplyId(null)
    setStatusMessage(`리뷰 #${reviewId} 답변을 저장했습니다.`)
  }

  const updateInquiryAnswerDraft = (inquiryId: number, answer: string) => {
    setInquiryAnswerDrafts((current) => ({ ...current, [inquiryId]: answer }))
  }

  const openInquiryReplyEditor = (inquiryId: number) => {
    const target = inquiries.find((row) => row.id === inquiryId)
    setInquiryAnswerDrafts((current) => ({ ...current, [inquiryId]: current[inquiryId] ?? target?.answer ?? '' }))
    setOpenInquiryReplyId(inquiryId)
  }

  const cancelInquiryReply = (inquiryId: number) => {
    const target = inquiries.find((row) => row.id === inquiryId)
    setInquiryAnswerDrafts((current) => ({ ...current, [inquiryId]: target?.answer ?? '' }))
    setOpenInquiryReplyId(null)
  }

  const submitInquiryAnswer = (inquiryId: number) => {
    const draft = (inquiryAnswerDrafts[inquiryId] ?? '').trim()
    if (!draft) {
      setStatusMessage('문의 답변 내용을 입력하세요.')
      return
    }
    setInquiries((current) => current.map((row) => (row.id === inquiryId ? { ...row, answer: draft } : row)))
    setInquiryAnswerDrafts((current) => ({ ...current, [inquiryId]: draft }))
    setOpenInquiryReplyId(null)
    setStatusMessage(`문의 #${inquiryId} 답변을 저장했습니다.`)
  }

  return (
    <PartnerShell activeSidebarItem="상품 조회/수정" onNavigate={onNavigate} isSidebarCollapsed={isSidebarCollapsed}>
      <div className="product-edit-page review-admin-page">
        <div className="page-header">
          <button
            type="button"
            className="back-button"
            aria-label={isSidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            aria-pressed={isSidebarCollapsed}
            onClick={() => setIsSidebarCollapsed((current) => !current)}
          >
            <span
              className={isSidebarCollapsed ? 'chevron chevron--right' : 'chevron chevron--left'}
              aria-hidden="true"
            />
          </button>

          <div className="page-header__main">
            <div className="page-title-row">
              <h1>리뷰/댓글 조회</h1>
              <span className="required-guide">
                <span className="required-dot" aria-hidden="true" />
                판매자 운영 화면
              </span>
            </div>
            <div className="page-actions">
              <button type="button" className="guide-button guide-button--muted" onClick={() => onNavigate?.('product-inquiry')}>
                목록으로
              </button>
              <button type="button" className="guide-button guide-button--accent" onClick={() => onNavigate?.('product-edit')}>
                수정하기
              </button>
            </div>
          </div>

          <span className="feedback feedback--info" role="status">
            {statusMessage}
          </span>
        </div>

        <div className="product-form">
          <div className="form-stack">
            <section className="form-section">
              <header className="form-section__header">
                <div className="form-section__title">
                  <h2>대상 상품</h2>
                </div>
              </header>
              <div className="form-section__body">
                <div className="review-admin-product-card">
                  <img src={product.imageSrc} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.shortDescription}</p>
                    <span>
                      카테고리 {product.category} · {product.priceText} · {product.status}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="form-section">
              <header className="form-section__header">
                <div className="form-section__title">
                  <h2>AI 리뷰 요약 및 개선 리포트</h2>
                </div>
                <div className="form-section__tools">
                  <button type="button" className="guide-button guide-button--muted review-admin-run-button" onClick={runAiSummary}>
                    {summaryLoading ? <span className="review-admin-spinner" aria-hidden="true" /> : null}
                    AI 리뷰 분석
                  </button>
                  <button
                    type="button"
                    className="guide-button guide-button--accent review-admin-run-button"
                    onClick={publishImprovementReport}
                  >
                    {reportLoading ? <span className="review-admin-spinner" aria-hidden="true" /> : null}
                    개선 리포트 발행
                  </button>
                </div>
              </header>

              <div className="form-section__body">
                <div className="review-admin-analysis">
                  {!summaryReady && !reportReady && !summaryLoading && !reportLoading && (
                    <p className="review-admin-analysis__placeholder">버튼을 눌러 분석 결과를 생성하세요.</p>
                  )}

                  {(summaryLoading || reportLoading) && (
                    <div className="review-admin-loading-panel">
                      <span className="review-admin-spinner review-admin-spinner--large" aria-hidden="true" />
                      <p>{summaryLoading ? '리뷰를 분석하고 있어요...' : '개선 리포트를 만들고 있어요...'}</p>
                    </div>
                  )}

                      {summaryReady && !summaryLoading && (
                        <div className="review-admin-highlight-grid">
                          <article className="review-admin-highlight review-admin-highlight--headline">
                            <h3>AI 리뷰 요약</h3>
                            <p>{buyerSummaryText}</p>
                          </article>
                          <article className="review-admin-highlight review-admin-highlight--good">
                            <h4>좋았던 점</h4>
                            <ul>
                              <li>
                                {topPositiveTopic
                                  ? `"${topPositiveTopic.topic}" 항목에서 긍정 반응이 가장 많았습니다.`
                                  : '전반 항목에서 긍정 반응이 고르게 확인됩니다.'}
                              </li>
                              <li>신선도와 맛 관련 긍정 키워드가 다수 확인됩니다.</li>
                            </ul>
                          </article>
                          <article className="review-admin-highlight review-admin-highlight--warn">
                            <h4>주의할 점</h4>
                            <ul>
                              <li>
                                {topRiskTopic
                                  ? `일부 리뷰에서 "${topRiskTopic.topic}" 관련 아쉬움이 확인되었습니다.`
                                  : '현재 치명적인 반복 불만은 확인되지 않았습니다.'}
                              </li>
                            </ul>
                          </article>
                      <article className="review-admin-highlight review-admin-highlight--recommend">
                        <h4>추천 대상</h4>
                        <p>2~3일 내 조리 예정 고객, 신선도 우선 고객에게 추천</p>
                      </article>
                    </div>
                  )}

                  {reportReady && !reportLoading && (
                    <>
                      <article className="review-admin-report-card">
                        <h3>판매자 개선 리포트</h3>
                        <ul>
                          {sellerReportLines.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </article>

                      <div className="review-admin-topic-table">
                        <table>
                          <thead>
                            <tr>
                              <th>분석 항목</th>
                              <th>긍정</th>
                              <th>중립</th>
                              <th>부정</th>
                              <th>개선 우선순위</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topicScores.map((row) => (
                              <tr key={row.topic}>
                                <td>{row.topic}</td>
                                <td>{row.positive}</td>
                                <td>{row.neutral}</td>
                                <td>{row.negative}</td>
                                <td>{scoreToActionPriority(row)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="form-section">
              <header className="form-section__header">
                <div className="form-section__title">
                  <h2>리뷰 댓글 조회/답변</h2>
                </div>
              </header>
              <div className="form-section__body">
                <div className="review-admin-list">
                  {reviews.map((review) => (
                    <article key={review.id} className="review-admin-item">
                      <header>
                        <strong>
                          {review.author} · {ratingToText(review.rating)}
                        </strong>
                        <span>{review.createdAt}</span>
                      </header>
                      <p>{review.content}</p>
                      {review.reply.trim() && <p className="review-admin-answer">판매자 댓글: {review.reply}</p>}
                      {openReviewReplyId === review.id ? (
                        <div className="review-admin-reply">
                          <textarea
                            value={reviewReplyDrafts[review.id] ?? review.reply}
                            onChange={(event) => updateReviewReplyDraft(review.id, event.target.value)}
                            placeholder="리뷰 답변을 입력하세요."
                          />
                          <div className="review-admin-reply__actions">
                            <button type="button" className="review-admin-reply__cancel" onClick={() => cancelReviewReply(review.id)}>
                              취소
                            </button>
                            <button type="button" onClick={() => submitReviewReply(review.id)}>
                              답변 등록
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" className="review-admin-inline-action" onClick={() => openReviewReplyEditor(review.id)}>
                          {review.reply.trim() ? '답변 수정' : '답변 달기'}
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="form-section">
              <header className="form-section__header">
                <div className="form-section__title">
                  <h2>상품 문의 답변</h2>
                </div>
              </header>
              <div className="form-section__body">
                <div className="review-admin-list">
                  {inquiries.map((inquiry) => (
                    <article key={inquiry.id} className="review-admin-item">
                      <header>
                        <strong>{inquiry.author}</strong>
                        <span>{inquiry.createdAt}</span>
                      </header>
                      <p className="review-admin-question">Q. {inquiry.question}</p>
                      {inquiry.answer.trim() && <p className="review-admin-answer">A. {inquiry.answer}</p>}
                      {openInquiryReplyId === inquiry.id ? (
                        <div className="review-admin-reply">
                          <textarea
                            value={inquiryAnswerDrafts[inquiry.id] ?? inquiry.answer}
                            onChange={(event) => updateInquiryAnswerDraft(inquiry.id, event.target.value)}
                            placeholder="문의 답변을 입력하세요."
                          />
                          <div className="review-admin-reply__actions">
                            <button type="button" className="review-admin-reply__cancel" onClick={() => cancelInquiryReply(inquiry.id)}>
                              취소
                            </button>
                            <button type="button" onClick={() => submitInquiryAnswer(inquiry.id)}>
                              답변 등록
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" className="review-admin-inline-action" onClick={() => openInquiryReplyEditor(inquiry.id)}>
                          {inquiry.answer.trim() ? '답변 수정' : '답변 쓰기'}
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PartnerShell>
  )
}
