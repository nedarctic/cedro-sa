'use client'

import { BreadCrumb } from "@/components/breadcrumb";
import { refreshToken } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export default function Page() {


  return (
    <div>
      <BreadCrumb page={"Dashboard"} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col items-center min-h-screen w-full justify-center">
            <h1>Dashboard</h1>            
            </div>
        </div>
      </div>
    </div>
  )
}
