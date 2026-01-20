import { getCompanyWithStats } from "@/lib/services/companies"
import { notFound } from "next/navigation"

type PageProps = {
  params: {
    slug: string
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const company = await getCompanyWithStats(params.slug)

  if (!company) {
    notFound()
  }

  return (
    <div>
      <h1>{company.name}</h1>
      {/*company.location*/}
      <p>
      {[company.city, company.state].filter(Boolean).join(", ")}
      </p>


      <p>⭐ {company.averageRating}</p>
      <p>{company.totalReviews} avaliações</p>
    </div>
  )
}
