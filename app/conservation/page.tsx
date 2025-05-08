"use client";
import React, { useState, useEffect } from "react";  // Import useState from React
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@radix-ui/themes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { fetchVolunteerOpportunitiesWithAssets } from "@/supabase/index"; // Import function to fetch data
import { DropdownMenu, Theme } from "@radix-ui/themes";
import { supabase } from '@/supabase/index'; // Import Supabase client

// Helper function to fetch image URL from Supabase Storage
const fetchImageUrl = async (path: string) => {
  try {
    const { data: publicUrlData, error: publicUrlError } = supabase
      .storage
      .from('jernih')  // Bucket name (make sure it's correct)
      .getPublicUrl(`${path}`);  // Path to the image in the 'locations' folder

    if (publicUrlError) {
      console.error('Error fetching public URL:', publicUrlError);
      return '';  // Return an empty string if there's an error
    }

    return publicUrlData?.publicUrl || '';  // Return the public URL
  } catch (error: any) {
    console.error('Error fetching image:', error.message);
    return '';  // Return an empty string if there's an error
  }
};

// Helper function to fetch the default image URL
const fetchDefaultImageUrl = async () => {
  try {
    const { data: publicUrlData, error: publicUrlError } = supabase
      .storage
      .from('jernih')  // Bucket name (make sure it's correct)
      .getPublicUrl('locations/default-image.jpg');  // Path to the default image

    if (publicUrlError) {
      console.error('Error fetching default image URL:', publicUrlError);
      return '';  // Return an empty string if there's an error
    }

    return publicUrlData?.publicUrl || '';  // Return the public URL
  } catch (error: any) {
    console.error('Error fetching default image:', error.message);
    return '';  // Return an empty string if there's an error
  }
};

const VolunteerOpportunityListing = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [filteredOpportunities, setFilteredOpportunities] = useState<any[]>([]);

  // State to hold image URLs for each asset
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  // State to hold the default image URL
  const [defaultImageUrl, setDefaultImageUrl] = useState<string>("");

  useEffect(() => {
    const loadOpportunities = async () => {
      const opportunities = await fetchVolunteerOpportunitiesWithAssets();
      setFilteredOpportunities(opportunities);

      // Fetch image URLs for each asset
      opportunities.forEach(async (opportunity) => {
        if (opportunity.assets?.length > 0) {
          const assetUrls = await Promise.all(
            opportunity.assets.map(async (asset: any) => {
              const imageUrl = await fetchImageUrl(asset.path);
              return { [asset.id]: imageUrl };
            })
          );

          // Flatten and merge the asset URLs
          const assetUrlsMap = Object.assign({}, ...assetUrls);
          setImageUrls((prevUrls) => ({ ...prevUrls, ...assetUrlsMap }));
        }
      });
    };

    // Fetch default image URL
    const loadDefaultImage = async () => {
      const url = await fetchDefaultImageUrl();
      setDefaultImageUrl(url);
    };

    loadOpportunities();
    loadDefaultImage();
  }, []);

  // Search and filter logic
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterOpportunities(query, locationFilter);
  };

  const handleFilter = (location: string) => {
    setLocationFilter(location);
    filterOpportunities(searchQuery, location);
  };

  const filterOpportunities = (search: string, location: string) => {
    let filtered = filteredOpportunities;

    if (search) {
      filtered = filtered.filter((opp) =>
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter((opp) =>
        opp.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredOpportunities(filtered);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Volunteer Opportunities</h1>

      {/* Search Input with Lucide Search Icon */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <Search style={{ marginRight: "8px" }} /> {/* Search Icon */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for volunteer opportunities..."
          style={{
            padding: "8px",
            fontSize: "16px",
            width: "100%",
            maxWidth: "400px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Dropdown for location filter */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button>Filter by Location</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={() => handleFilter("Bali")}>Bali</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => handleFilter("Jakarta")}>Jakarta</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => handleFilter("Kalimantan")}>Kalimantan</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Volunteer Opportunity Listings in Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opportunity: any) => (
            <Card
              key={opportunity.id}
              className="col-span-full bg-white shadow-lg rounded-xl flex p-3"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%), url(${imageUrls[opportunity.id] || defaultImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '300px',  // Set a fixed height for the card

              }}
            >
              <div className="flex-1 p-4 ">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{opportunity.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Location:</strong> {opportunity.location}
                  </p>
                  <p>
                    <strong>Date:</strong> {opportunity.date}
                  </p>
                  <p>{opportunity.description}</p>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <p>No volunteer opportunities found.</p>
        )}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <Theme>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <Sidebar className="hidden md:flex" />
          <main className="flex-1 p-6 md:p-8">
            <VolunteerOpportunityListing /> {/* Include VolunteerOpportunityListing component here */}
          </main>
        </div>
      </div>
    </Theme>
  );
}
