import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TableDisplay from '@/components/costs/TableDisplay.vue'

describe('DataTable Component', () => {
  const mockData = {
    item1: { name: 'Product A', price: 19.99 },
    item2: { name: 'Product B', price: 29.99 },
    item3: { name: 'Product C', price: 39.99 }
  }

  const mockCategory = 'Electronics'

  it('renders the table with correct structure', () => {
    const wrapper = mount(TableDisplay, {
      props: {
        data: mockData,
        category: mockCategory
      }
    })

    expect(wrapper.find('table.table-wrapper').exists()).toBe(true)
    expect(wrapper.find('thead.table-wrapper__header').exists()).toBe(true)
    expect(wrapper.find('tbody.table-wrapper__body').exists()).toBe(true)
  })

  it('displays the correct category in header', () => {
    const wrapper = mount(TableDisplay, {
      props: {
        data: mockData,
        category: mockCategory
      }
    })

    const header = wrapper.find('th')
    expect(header.text()).toBe(mockCategory)
    expect(header.attributes('aria-label')).toBe('Product category')
  })

  it('renders column headers correctly', () => {
    const wrapper = mount(TableDisplay, {
      props: {
        data: mockData,
        category: mockCategory
      }
    })

    const headers = wrapper.findAll('tbody tr.row').at(0)?.findAll('td')
    expect(headers?.length).toBe(2)
    expect(headers?.at(0)?.text()).toBe('Item')
    expect(headers?.at(1)?.text()).toBe('Price')
  })

  it('renders all data rows correctly', () => {
    const wrapper = mount(TableDisplay, {
      props: {
        data: mockData,
        category: mockCategory
      }
    })

    const rows = wrapper.findAll('tbody tr.row').slice(1)
    expect(rows.length).toBe(Object.keys(mockData).length)

    rows.forEach((row, index) => {
      const cells = row.findAll('td')
      const dataKey = Object.keys(mockData)[index]
      const item = mockData[dataKey as keyof typeof mockData]

      expect(cells[0].classes()).toContain('name')
      expect(cells[0].text()).toBe(item.name)
      expect(cells[0].attributes('aria-label')).toBe('Product name')

      expect(cells[1].classes()).toContain('price')
      expect(cells[1].text()).toBe(`$${item.price.toFixed(2)} USD`)
      expect(cells[1].attributes('aria-label')).toBe('Product price')
    })
  })

  it('handles empty data prop gracefully', () => {
    const wrapper = mount(TableDisplay, {
      props: {
        data: {},
        category: mockCategory
      }
    })

    const rows = wrapper.findAll('tbody tr.row')
    expect(rows.length).toBe(1)
  })

  it('formats prices correctly with 2 decimal places', () => {
    const testData = {
      item1: { name: 'Test Product', price: 20 }
    }

    const wrapper = mount(TableDisplay, {
      props: {
        data: testData,
        category: mockCategory
      }
    })

    const priceCell = wrapper.find('td.price')
    expect(priceCell.text()).toBe('$20.00 USD')
  })

  it('matches snapshot with data', () => {
    const wrapper = mount(TableDisplay, {
      props: {
        data: mockData,
        category: mockCategory
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('matches snapshot with empty data', () => {
    const wrapper = mount(TableDisplay, {
      props: {
        data: {},
        category: mockCategory
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
