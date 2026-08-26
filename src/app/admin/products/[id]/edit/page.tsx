import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/page-guards";
import { getProductById } from "@/services/productService";
import ProductForm from "@/components/admin/ProductForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  await requireAdminPage(`/admin/products/${id}/edit`);

  const product = await getProductById(id).catch(() => null);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10 text-ink">Edit {product.name}</h1>
      <ProductForm initial={product} />
    </div>
  );
}
