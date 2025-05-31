"use client";
import "@radix-ui/themes/styles.css";
import React, { useState, useEffect} from "react";  // Import useState from React
import { Button , TextField, Flex , Text, Card} from "@radix-ui/themes";
import { fetchVolunteerOpportunitiesWithAssets } from "@/utils/supabase/conservation";
import { DropdownMenu, Theme } from "@radix-ui/themes";
import { useRouter } from 'next/navigation';
import { BrowserRouter } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { fetchImageUrl, fetchDefaultImageUrl } from "@/utils/supabase/client"

const VolunteerOpportunityListing = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [originalOpportunities, setOriginalOpportunities] = useState<any[]>([]); // State to hold original data
  const [filteredOpportunities, setFilteredOpportunities] = useState<any[]>([]);
  // State to hold image URLs for each asset
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  // State to hold the default image URL
  const [defaultImageUrl, setDefaultImageUrl] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]); 
  const router = useRouter(); 
  useEffect(() => {
    const loadOpportunities = async () => {
      const opportunities = await fetchVolunteerOpportunitiesWithAssets();
      setOriginalOpportunities(opportunities);
      setFilteredOpportunities(opportunities);
      
      const uniqueLocations = [
        ...new Set(opportunities.map((opp: any) => opp.location))  // Unique locations
      ];
      setLocations(uniqueLocations.slice(0, 5));

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

  const resetLocationFilter = () => {
    setLocationFilter("");
    filterOpportunities(searchQuery, ""); // Reset the filter
  };

  const handleFilter = (location: string) => {
    setLocationFilter(location);
    filterOpportunities(searchQuery, location);
  };

  const filterOpportunities = (search: string, location: string) => {
    // Create a copy of the original data to filter
    let filtered = [...originalOpportunities];

    // Apply search filter
    if (search) {
      filtered = filtered.filter((opp) =>
        opp.title.toLowerCase().includes(search.toLowerCase()) ||
        opp.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply location filter
    if (location) {
      filtered = filtered.filter((opp) =>
        opp.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Update the filtered state
    setFilteredOpportunities(filtered);

    // Log the filtered data for debugging
    console.log("filtered : ", filtered);
  };

  return (
    <Flex direction="column" gap="3">
      <h1 className="text-3xl font-bold tracking-tight">Peluang Relawan</h1>
      {/* Kolom Pencarian dengan Ikon Lucide Search */}
      <Flex direction="row" gap="3">
        <TextField.Root placeholder="Cari relawan" value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}>
          <TextField.Slot >
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant="outline" size="2" color="sky">
              Filter lokasi
              <DropdownMenu.TriggerIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content size="2" variant="solid" color="tomato">
            <DropdownMenu.Item onSelect={() => resetLocationFilter()}>Semua</DropdownMenu.Item>
            {locations.map((location, index) => (
              <DropdownMenu.Item color="sky" key={index} onSelect={() => handleFilter(location)}>
                {location}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
      {/* Volunteer Opportunity Listings in Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opportunity: any) => (
            <Card
              key={opportunity.id}
              className="col-span-full bg-white shadow-lg rounded-xl flex p-3"
              onClick={() => router.push(`/conservation/${opportunity.id}`)}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%), url(${imageUrls[opportunity.id] || defaultImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '300px',  // Set a fixed height for the card
              }}
            >

              <Flex direction="column" gap="3" align="stretch" >
                <Flex direction="column" gap="3" align="start" className=" p-4 rounded-xl w-full h-full overflow-hidden">
                  <Text
                    as="div"
                    weight="bold"
                    style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
                  >
                    {opportunity.title}
                  </Text>
                  <Text as="div" color="gray" size="2">
                    <strong>Lokasi:</strong> {opportunity.location}
                  </Text>
                  <Text as="div" color="gray" size="2">
                    <strong>Tanggal:</strong> {opportunity.created_at}
                  </Text>
                  <Text as="div" color="gray" size="2" className="line-clamp-3">
                    {opportunity.description}
                  </Text>
                </Flex>
              </Flex>
            </Card>
          ))
        ) : (
          <p>Tidak ada peluang relawan yang ditemukan.</p>
        )}
      </div>
    </Flex>
  );
};

export default function HomePage() {
  return (
    <BrowserRouter> 
      <Theme>
        <div className="flex min-h-screen flex-col">
          <div className="flex flex-1">
            <main className="flex-1 p-6 md:p-8">
              <VolunteerOpportunityListing />{" "}
              {/* Include VolunteerOpportunityListing component here */}
            </main>
          </div>
        </div>
      </Theme>
    </BrowserRouter> 
  );
}
