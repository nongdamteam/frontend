import { useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './App.css'

type SectionCardProps = {
  title: string
  children: ReactNode
}

type ProductForm = {
  category: string
  name: string
  price: string
  stock: string
  status: '판매중' | '판매대기'
  description: string
}

const categoryOptions = [
  '농산물 > 채소 > 잎채소',
  '농산물 > 채소 > 뿌리채소',
  '농산물 > 과일 > 제철과일',
  '농산물 > 곡물 > 쌀/잡곡',
  '가공식품 > 반찬/절임',
  '가공식품 > 음료/청',
]

const initialForm: ProductForm = {
  category: '',
  name: '',
  price: '',
  stock: '',
  status: '판매중',
  description: '',
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="section-card" aria-labelledby={`${title}-section`}>
      <h3 id={`${title}-section`}>{title}</h3>
      <div className="section-card__body">{children}</div>
    </section>
  )
}

function App() {
  const [form, setForm] = useState<ProductForm>(() => {
    const savedForm = localStorage.getItem('product-draft')
    return savedForm ? (JSON.parse(savedForm) as ProductForm) : initialForm
  })
  const [categoryKeyword, setCategoryKeyword] = useState('')
  const [message, setMessage] = useState('필수 정보를 입력한 뒤 저장하세요.')
  const [showPreview, setShowPreview] = useState(false)

  const filteredCategories = useMemo(() => {
    const keyword = categoryKeyword.trim()
    if (!keyword) {
      return categoryOptions
    }

    return categoryOptions.filter((category) => category.includes(keyword))
  }, [categoryKeyword])

  const formattedPrice = form.price
    ? `${Number(form.price).toLocaleString('ko-KR')}원`
    : '판매가 미입력'

  const updateField = (field: keyof ProductForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const handleDraftSave = () => {
    localStorage.setItem('product-draft', JSON.stringify(form))
    setMessage('임시저장되었습니다.')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.category || !form.name.trim() || !form.price) {
      setMessage('카테고리, 상품명, 판매가는 필수입니다.')
      return
    }

    localStorage.removeItem('product-draft')
    setMessage('상품이 저장되었습니다.')
    setShowPreview(true)
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar" aria-label="관리 메뉴">
        <div className="sidebar__brand">통합 매니저</div>
        <nav className="sidebar__nav">
          <button type="button" className="sidebar__item">
            상품관리
          </button>
          <button
            type="button"
            className="sidebar__item sidebar__item--active"
            aria-current="page"
          >
            상품 등록
          </button>
          <button type="button" className="sidebar__item sidebar__item--sub">
            상품 조회/수정
          </button>
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <span className="topbar__user">사용자</span>
          <span>님 내정보 | 로그아웃</span>
        </header>

        <form className="content" onSubmit={handleSubmit}>
          <div className="content__header">
            <div>
              <h1>상품 등록</h1>
              <p>판매할 상품의 기본 정보를 입력하세요.</p>
            </div>
            <span className="content__state" role="status">
              {message}
            </span>
          </div>

          <div className="content__grid">
            <div className="form-column">
              <SectionCard title="카테고리">
                <label className="field-label" htmlFor="categorySearch">
                  카테고리 검색
                </label>
                <input
                  id="categorySearch"
                  type="search"
                  value={categoryKeyword}
                  onChange={(event) => setCategoryKeyword(event.target.value)}
                  placeholder="예: 채소, 과일, 쌀"
                  className="text-field"
                />

                <div className="category-list" aria-label="카테고리 선택">
                  {filteredCategories.map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={
                        form.category === category
                          ? 'category-option category-option--selected'
                          : 'category-option'
                      }
                      onClick={() => updateField('category', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="상품명">
                <label className="field-label" htmlFor="productName">
                  상품명
                </label>
                <input
                  id="productName"
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="상품명을 입력하세요"
                  className="text-field"
                  maxLength={60}
                />
              </SectionCard>

              <SectionCard title="판매 정보">
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label" htmlFor="productPrice">
                      판매가
                    </label>
                    <div className="input-with-unit">
                      <input
                        id="productPrice"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) =>
                          updateField('price', event.target.value)
                        }
                        placeholder="숫자만 입력"
                        className="text-field"
                      />
                      <span>원</span>
                    </div>
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="productStock">
                      재고
                    </label>
                    <input
                      id="productStock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(event) =>
                        updateField('stock', event.target.value)
                      }
                      placeholder="수량"
                      className="text-field"
                    />
                  </div>
                </div>

                <fieldset className="segmented-control">
                  <legend>판매 상태</legend>
                  {(['판매중', '판매대기'] as const).map((status) => (
                    <label key={status}>
                      <input
                        type="radio"
                        name="status"
                        checked={form.status === status}
                        onChange={() => updateField('status', status)}
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </fieldset>
              </SectionCard>

              <SectionCard title="상품 설명">
                <label className="field-label" htmlFor="productDescription">
                  간단 설명
                </label>
                <textarea
                  id="productDescription"
                  value={form.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  placeholder="상품 특징, 원산지, 보관 방법 등을 입력하세요"
                  className="text-field text-area"
                  rows={5}
                />
              </SectionCard>
            </div>

            {showPreview && (
              <aside className="preview-panel" aria-label="상품 미리보기">
                <h2>미리보기</h2>
                <div className="preview-panel__image">상품 이미지</div>
                <dl>
                  <div>
                    <dt>카테고리</dt>
                    <dd>{form.category || '미선택'}</dd>
                  </div>
                  <div>
                    <dt>상품명</dt>
                    <dd>{form.name || '상품명 미입력'}</dd>
                  </div>
                  <div>
                    <dt>판매가</dt>
                    <dd>{formattedPrice}</dd>
                  </div>
                  <div>
                    <dt>재고</dt>
                    <dd>{form.stock ? `${form.stock}개` : '재고 미입력'}</dd>
                  </div>
                  <div>
                    <dt>상태</dt>
                    <dd>{form.status}</dd>
                  </div>
                </dl>
                <p>{form.description || '상품 설명이 여기에 표시됩니다.'}</p>
              </aside>
            )}
          </div>

          <div className="bottom-actions">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => setShowPreview((current) => !current)}
            >
              {showPreview ? '미리보기 닫기' : '미리보기'}
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={handleDraftSave}
            >
              임시저장
            </button>
            <button type="submit" className="button button--primary">
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
