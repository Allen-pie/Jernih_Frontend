// components/SiteNav.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const items = [
  { title: "Dashboard", href: "/dashboard", description: "Your home base" },
  { title: "Water Quality", href: "/water-quality", description: "Live data" },
  {
    title: "Report Pollution",
    href: "/report-pollution",
    description: "Log an issue",
  },
  { title: "Communities", href: "/communities", description: "Join locals" },
  {
    title: "Conservation",
    href: "/conservation",
    description: "Our initiatives",
  },
  {
    title: "Education & Resources",
    href: "/resources",
    description: "Learn more",
  },
];

export function SiteNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              // keep it transparent by default
              "!bg-transparent",
              // on hover, tint it
              "hover:!bg-accent hover:!text-accent-foreground",
              // when the menu is open, keep it tinted
              "data-[state=open]:!bg-accent",
              // smooth transition
              "transition-colors"
            )}
          >
            Features
          </NavigationMenuTrigger>
          {/* 1) Give your panel a width + padding */}
          <NavigationMenuContent
            className={cn(
              "absolute right-0 mt-2 rounded-lg shadow-lg z-50",
              "bg-white/20 backdrop-blur-lg border border-white/20",
              "w-[320px] md:w-[440px] max-w-[90vw] max-h-[80vh] overflow-auto",
              "p-4 sm:p-6"
            )}
          >
            <ul className="grid gap-x-8 gap-y-6 md:grid-cols-2">
              {items.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className="block rounded-md p-2 hover:bg-white/10"
                    >
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>
                      <p className="text-sm text-gray-700">
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>

      {/* 2) Don’t forget these! They handle the underline and the viewport */}
      <NavigationMenuIndicator />
    </NavigationMenu>
  );
}
