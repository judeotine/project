"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = () => {
    // Implement search logic here
    console.log("Searching for:", { searchTerm, category, location })
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Search products or services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch} className="bg-amber-600 hover:bg-amber-700">
          Search
        </Button>
      </div>
      <div className="flex gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="services">Services</SelectItem>
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new-york">New York</SelectItem>
            <SelectItem value="los-angeles">Los Angeles</SelectItem>
            <SelectItem value="chicago">Chicago</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

