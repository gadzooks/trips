// components/page-header.tsx
interface PageHeaderProps {
    name: string
    description?: string
  }
  
  export function PageHeader({ name, description }: PageHeaderProps) {
    return (
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{name}</h1>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
      </div>
    )
  }