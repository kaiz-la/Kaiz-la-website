'use client';

import React, { ReactNode } from 'react';
import { Plus } from "lucide-react";
import Link from 'next/link';

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background">
      <main className="flex flex-1 flex-col h-full min-w-0">
        <header className="flex h-16 sm:h-18 lg:h-20 shrink-0 items-center gap-4 border-b border-border bg-white/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center group" aria-label="Kaiz La Home">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/kaizla-horizontal.svg"
                  alt="Kaiz La"
                  width={135}
                  height={44}
                  className="h-9 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-10"
                />
              </Link>
              <div className="hidden items-center gap-2 border-l border-border pl-4 sm:flex">
                <div>
                  <div className="text-sm font-semibold leading-tight text-ink">Sourcing Desk</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Online · replies in minutes
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 xl:gap-4">
              <Link href="/chat">
                <button className="
                  flex items-center gap-2 px-4 py-2 xl:px-5 xl:py-2.5
                  bg-crimson text-white rounded-full
                  hover:bg-[var(--color-crimson-deep)] hover:shadow-md
                  transition-all duration-200 font-semibold
                  text-sm xl:text-base
                  focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2
                ">
                  <Plus className="size-4" />
                  <span className="hidden sm:inline">New Chat</span>
                </button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pb-4">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}