import type { ReactNode } from 'react'
import { quickLinks, sidebarItems, topNavigationItems } from '../../config/productRegistrationConfig'
import type { AppView } from '../../app/appTypes'
import nongdamLogo from '../../assets/nongdam-logo.svg'

type SidebarItem = (typeof sidebarItems)[number]

type PartnerShellProps = {
  activeSidebarItem: SidebarItem['label']
  children: ReactNode
  onNavigate?: (view: AppView) => void
  onSidebarAction?: (label: SidebarItem['label']) => void
  isSidebarCollapsed?: boolean
}

function SidebarIcon({ name }: { name: SidebarItem['icon'] }) {
  const commonProps = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 2,
  }

  return (
    <svg className="side-nav__icon" viewBox="0 0 24 24" aria-hidden="true" {...commonProps}>
      {name === 'product' && (
        <>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6.5 9.5V20h11V9.5" />
          <path d="M10 20v-6h4v6" />
        </>
      )}
      {name === 'groupBuy' && (
        <>
          <path d="M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M3.5 20a4.5 4.5 0 0 1 7 0" />
          <path d="M13.5 20a4.5 4.5 0 0 1 7 0" />
        </>
      )}
      {name === 'inventory' && (
        <>
          <path d="M4 7.5 12 3l8 4.5-8 4.5L4 7.5Z" />
          <path d="M4 7.5v9L12 21l8-4.5v-9" />
          <path d="M12 12v9" />
        </>
      )}
      {name === 'chart' && (
        <>
          <path d="M4 19h16" />
          <path d="M7 16v-4" />
          <path d="M12 16V7" />
          <path d="M17 16v-7" />
        </>
      )}
      {name === 'delivery' && (
        <>
          <path d="M4 7h10v9H4z" />
          <path d="M14 10h3l3 3v3h-6" />
          <path d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </>
      )}
      {name === 'order' && (
        <>
          <path d="M7 5h10v16H7z" />
          <path d="M9 3h6l1 2H8l1-2Z" />
          <path d="M10 10h4" />
          <path d="M10 14h4" />
        </>
      )}
      {name === 'image' && (
        <>
          <path d="M4 5h16v14H4z" />
          <path d="m4 16 4.5-4.5 3.5 3.5 2-2 6 6" />
          <path d="M16 9.5h.01" />
        </>
      )}
      {name === 'settings' && (
        <>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
          <path d="M19 12h2" />
          <path d="M3 12h2" />
          <path d="m17 17 1.4 1.4" />
          <path d="m5.6 5.6 1.4 1.4" />
          <path d="m17 7 1.4-1.4" />
          <path d="m5.6 18.4 1.4-1.4" />
        </>
      )}
      {name === 'store' && (
        <>
          <path d="M5 10.5h14" />
          <path d="M6 10.5V19h12v-8.5" />
          <path d="M4.5 10.5 6 5h12l1.5 5.5" />
          <path d="M8.2 14h7.6" />
        </>
      )}
    </svg>
  )
}

export function PartnerShell({
  activeSidebarItem,
  children,
  onNavigate,
  onSidebarAction,
  isSidebarCollapsed = false,
}: PartnerShellProps) {
  const handleTopNavigation = (item: string) => {
    if (item === '상품관리') {
      onNavigate?.('product-register')
    }

    if (item === '공동구매') {
      onNavigate?.('group-buy-register')
    }

    if (item === '상점 정보') {
      onNavigate?.('store-info')
    }
  }

  const handleSidebarClick = (label: SidebarItem['label']) => {
    onSidebarAction?.(label)

    if (label === '상품 등록') {
      onNavigate?.('product-register')
    }

    if (label === '공동구매 등록') {
      onNavigate?.('group-buy-register')
    }

    if (label === '상품 조회/수정') {
      onNavigate?.('product-inquiry')
    }

    if (label === '진행중 공동구매') {
      onNavigate?.('group-buy-progress')
    }

    if (label === '상점 정보') {
      onNavigate?.('store-info')
    }
  }

  return (
    <div className="commerce-shell">
      <header className="global-header">
        <div className="global-header__brand">
          <img src={nongdamLogo} alt="" />
          <strong>농담 파트너센터</strong>
        </div>
        <nav className="global-nav" aria-label="상단 메뉴">
          {topNavigationItems.map((item) => (
            <button type="button" key={item} onClick={() => handleTopNavigation(item)}>
              {item}
            </button>
          ))}
        </nav>
        <div className="global-user">
          <strong>woonggi4283</strong>
          <span>님</span>
          <button type="button" className="user-badge">
            내정보
          </button>
          <button type="button" className="logout-button">
            로그아웃
          </button>
        </div>
      </header>

      <div className={isSidebarCollapsed ? 'commerce-body is-sidebar-collapsed' : 'commerce-body'}>
        <aside className="side-panel" aria-label="상품 관리 메뉴">
          <div className="side-profile-card">
            <div className="side-profile-card__avatar" aria-hidden="true">
              웅
            </div>
            <div className="side-profile-card__text">
              <strong>웅찬하리보</strong>
              <span>통합 매니저</span>
            </div>
            <button type="button" aria-label="내정보">
              내정보
            </button>
          </div>

          <nav className="side-nav">
            {sidebarItems.map((item) => (
              <button
                type="button"
                key={item.label}
                className={item.label === activeSidebarItem ? 'side-nav__item is-active' : 'side-nav__item'}
                aria-current={item.label === activeSidebarItem ? 'page' : undefined}
                onClick={() => handleSidebarClick(item.label)}
              >
                <SidebarIcon name={item.icon} />
                <span>{item.label}</span>
                {item.label === activeSidebarItem && (
                  <span className="side-nav__arrow" aria-hidden="true">
                    ›
                  </span>
                )}
              </button>
            ))}
          </nav>

          <button type="button" className="side-visit-button">
            사이트 방문
          </button>
        </aside>

        <main className="product-workspace">{children}</main>

        <aside className="quick-rail" aria-label="바로가기">
          {quickLinks.map((link) => (
            <button type="button" key={link.label} className="quick-rail__item">
              <span className={`quick-rail__icon quick-rail__icon--${link.tone}`}>
                {link.mark}
                {link.badge && <span className="new-badge">NEW</span>}
              </span>
              <span>{link.label}</span>
            </button>
          ))}
        </aside>
      </div>
    </div>
  )
}
