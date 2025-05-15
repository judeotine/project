"use client"

import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"
import PriceRangeInput from "@/components/PriceRangeInput"

const locationOptions = [
  { value: "new-york", label: "New York" },
  { value: "los-angeles", label: "Los Angeles" },
  { value: "chicago", label: "Chicago" },
  { value: "miami", label: "Miami" },
]

const categoryOptions = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home & Garden" },
  { value: "services", label: "Services" },
]

interface InlineFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function InlineFilters({ onFilterChange }: InlineFiltersProps) {
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    updateFilters({ minPrice: min, maxPrice: max })
  }

  const updateFilters = (newFilter: any) => {
    onFilterChange({
      minPrice,
      maxPrice,
      location,
      category,
      ...newFilter,
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Price Range</label>
        <PriceRangeInput min={minPrice} max={maxPrice} onPriceChange={handlePriceChange} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Combobox
          options={locationOptions}
          value={location}
          onValueChange={(value) => {
            setLocation(value)
            updateFilters({ location: value })
          }}
          placeholder="Select location"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Combobox
          options={categoryOptions}
          value={category}
          onValueChange={(value) => {
            setCategory(value)
            updateFilters({ category: value })
          }}
          placeholder="Select category"
        />
      </div>
    </div>
  )
}

