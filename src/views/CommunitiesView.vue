<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import LayoutCostly from '@/components/layout/LayoutCostly.vue'
import IconCostly from '@/components/common/IconCostly.vue'
import type { Community, CommunityKey } from '@/types/communities'
import { getCommunities } from '@/services/generalService.ts'
import Icon from '@/components/common/IconCostly.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { memoryCache } from '@/utils/cache.ts'
import SpinnerCostly from '@/components/common/SpinnerCostly.vue'

const allCards = ref([] as Community[])
const visibleCards = ref([] as Community[])
const batchSize = 20
const sentinel = ref(null)

const selectedCountry = ref('')
const selectedCity = ref('')
const selectedGroupType = ref('')

type SelectOptions = {
  name: string
  code?: string
}
const getUniqueValuesForKey = (key: CommunityKey): SelectOptions[] => {
  const seen = new Map<string, boolean>()
  const result: SelectOptions[] = []

  for (const card of filteredCards.value.length ? filteredCards.value : allCards.value) {
    const name = card[key]
    const code = key === 'country' ? card['code'] : null
    const keyStr = code ? `${name}|${code}` : (name as string)

    if (!seen.has(keyStr)) {
      seen.set(keyStr, true)
      //@ts-expect-error
      result.push(code !== null ? { name, code } : { name })
    }
  }

  return result
}

const filteredCards = computed(() => {
  return allCards.value.filter((card) => {
    return (
      (!selectedCountry.value || card.country === selectedCountry.value) &&
      (!selectedCity.value || card.city === selectedCity.value) &&
      (!selectedGroupType.value || card.type === selectedGroupType.value)
    )
  })
})

const loadMore = () => {
  const nextBatch = filteredCards.value.slice(
    visibleCards.value.length,
    visibleCards.value.length + batchSize,
  )
  visibleCards.value.push(...nextBatch)
}

watch(filteredCards, () => {
  visibleCards.value = filteredCards.value.slice(0, batchSize)
})

const loadCommunities = async () => {
  await getCommunities({})
    .then((data: Community[]) => {
      allCards.value = data
      memoryCache.set('communities', data)
    })
    .catch((e) => {
      throw e
    })
}

const initializeObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadMore()
      }
    },
    { rootMargin: '400px' },
  )

  if (sentinel.value) observer.observe(sentinel.value)
}

onMounted(async () => {
  let error
  if (memoryCache.has('communities')) {
    const cached = memoryCache.get<Community[]>('communities') ?? []
    if (cached) {
      allCards.value = cached
    } else {
      memoryCache.delete('communities')

      try {
        await loadCommunities()
      } catch (e) {
        error = e
      }
    }
  } else {
    try {
      await loadCommunities()
    } catch (e) {
      error = e
    }
  }
  if (error) return

  visibleCards.value = filteredCards.value.slice(0, batchSize)
  initializeObserver()
})

const showFilters = ref<boolean>(true)
const toggleFilters = () => (showFilters.value = !showFilters.value)
</script>

<template>
  <LayoutCostly>
    <template v-slot:headline>
      <h1>Nomad Communities</h1>
    </template>

    <template v-slot:content>
      <div class="communities-wrapper">
        <div :class="['communities-wrapper__inputs', { 'scrolled-up': showFilters }]">
          <SelectInput
            default-option-label="Vietnam"
            :options="getUniqueValuesForKey('country')"
            v-model="selectedCountry"
          >
            <template v-slot:input-icon><Icon name="country" alt="" /></template>
          </SelectInput>

          <SelectInput
            default-option-label="Hanoi"
            :options="getUniqueValuesForKey('city')"
            v-model="selectedCity"
          >
            <template v-slot:input-icon><Icon name="city" alt="" /></template>
          </SelectInput>

          <SelectInput
            default-option-label="Whatsapp"
            :options="getUniqueValuesForKey('type')"
            v-model="selectedGroupType"
          >
            <template v-slot:input-icon>
              <font-awesome-icon icon="fa-solid fa-hashtag" />
            </template>
          </SelectInput>

          <span class="toggle-filter" @click="toggleFilters"
            ><font-awesome-icon icon="fa-solid fa-sort-down"
          /></span>
        </div>

        <div class="communities-wrapper__list">
          <template v-if="visibleCards.length">
            <div class="list-item" v-for="item in visibleCards" :key="item.id">
              <div class="card">
                <div class="card__header">
                  <div>
                    <IconCostly alt="" :name="item.code" folder="flags" /> /
                    <b>{{ item.country }}</b>
                  </div>
                  <div>
                    Members: <b>{{ item.members }}</b>
                  </div>
                </div>
                <div class="card__body">
                  <a :href="item.group_link" target="_blank">
                    {{ item.group_name }} /#{{ item.type }}
                  </a>
                  <div class="tags" v-if="item.tags.length">
                    <div class="tag" v-for="tag in item.tags" :key="tag">
                      {{ tag }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div ref="sentinel" />
          </template>
          <template v-else>
            <SpinnerCostly />
          </template>
        </div>
      </div>
    </template>
  </LayoutCostly>
</template>

<style lang="scss" scoped>
$border-radius: 1rem;
$padding-default: 1rem;
$sticky-offset: 72px;

.communities-wrapper {
  &__inputs {
    position: sticky;
    top: $sticky-offset;
    width: 110%;
    padding: $padding-default 5% 1.25rem;
    background: $background-color;
    transform: translateX(-5%);
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    border-radius: 0 0 $border-radius $border-radius;
    margin: -1rem 0 2rem;
    box-shadow: 0 2px 2px $border-color;
    transition: top 0.5s ease-in-out;

    &.scrolled-up {
      top: -105px;
    }

    @include respond-md {
      width: 100%;
      gap: 15px;
      transform: none;
      padding: $padding-default 2.5%;

      &.scrolled-up {
        top: $sticky-offset;
      }
    }

    .toggle-filter {
      position: absolute;
      bottom: 5px;
      width: 100%;

      @include respond-sm {
        display: none;
      }
    }
  }

  &__list {
    display: grid;
    gap: 40px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

    .list-item {
      text-align: left;

      p {
        margin: 0;
      }
    }
  }

  .card {
    background: $white-color;
    border-radius: $border-radius;
    padding: 2rem;
    min-height: 185px;
    height: 100%;
    box-shadow: 0 0 4px $border-color;

    &__header {
      display: flex;
      justify-content: space-between;
    }

    &__body {
      a {
        display: flex;
        padding: 1rem 0;
        transition: text-decoration 0.3s ease-in-out;

        &:hover {
          text-decoration: underline;
        }
      }

      .tags {
        display: flex;
        flex-wrap: wrap;

        .tag {
          background: $border-color;
          font-size: 0.9rem;
          padding: 0.25rem 1rem;
          margin-right: 0.25rem;
          border-radius: $border-radius;
        }
      }
    }
  }
}
</style>
