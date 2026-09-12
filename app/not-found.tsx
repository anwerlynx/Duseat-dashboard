import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] font-sans">
      <div className="text-center">
        <h1 className="text-[72px] font-bold leading-none text-[#1f2327]">404</h1>
        <p className="mt-3 text-[18px] text-[#6f777f]">Page not found</p>
        <p className="mt-1 text-[14px] text-[#9da4ae]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-[40px] items-center rounded-[8px] bg-[#1f2327] px-5 text-[14px] font-medium text-white shadow-2xs hover:bg-[#2e3338] transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
