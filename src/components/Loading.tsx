import { LoaderIcon } from 'lucide-react'
import React from 'react'

export default function Loading({label}: {label?: string}) {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <LoaderIcon className="size-6 text-muted-foreground animate-spin" />
      {label && <span className="ml-2 text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
