// API 서비스 레이어
const API_BASE_URL = 'http://localhost:3000/api'

// 공통 fetch 함수
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'API 요청 실패')
    }

    return data
  } catch (error) {
    console.error('API 오류:', error)
    throw error
  }
}

// 메뉴 API
export const menuAPI = {
  // 메뉴 목록 조회
  getMenus: async () => {
    const response = await fetchAPI('/menus')
    return response.data
  },

  // 재고 수정
  updateStock: async (menuId, quantity) => {
    const response = await fetchAPI(`/menus/${menuId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    })
    return response.data
  },
}

// 주문 API
export const orderAPI = {
  // 주문 생성
  createOrder: async (orderData) => {
    const response = await fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
    return response.data
  },

  // 주문 목록 조회
  getOrders: async (status = null) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    const response = await fetchAPI(`/orders${query}`)
    return response.data
  },

  // 주문 정보 조회
  getOrderById: async (orderId) => {
    const response = await fetchAPI(`/orders/${orderId}`)
    return response.data
  },

  // 주문 상태 변경
  updateOrderStatus: async (orderId, status) => {
    const response = await fetchAPI(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    return response.data
  },
}
