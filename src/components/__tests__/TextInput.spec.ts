import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextInput from '@/components/input/TextInput.vue'

describe('TextInput', () => {
  it('renders properly with required props', async () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Email address',
        name: 'email',
      },
    })

    expect(wrapper.find('label').text()).toBe('Email address')
    expect(wrapper.find('input').attributes('name')).toBe('email')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('binds v-model correctly', async () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Email address',
        name: 'email',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test@example.com')
    expect(input.element.value).toBe('test@example.com')
  })

  it('sets input type correctly', () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Password',
        name: 'password',
        type: 'password',
      },
    })

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('applies placeholder correctly', () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Search',
        name: 'search',
        placeholder: 'Enter search term...',
      },
    })

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter search term...')
  })

  it('sets autocomplete attribute', () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Email',
        name: 'email',
        autocomplete: 'email',
      },
    })

    expect(wrapper.find('input').attributes('autocomplete')).toBe('email')
  })

  it('handles autofocus prop', () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Username',
        name: 'username',
        autofocus: true,
      },
    })

    expect(wrapper.find('input').attributes('autofocus')).toBe('')
  })

  it('emits update events when input changes', async () => {
    const wrapper = mount(TextInput, {
      props: {
        label: 'Test',
        name: 'test',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('new value')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })
})
