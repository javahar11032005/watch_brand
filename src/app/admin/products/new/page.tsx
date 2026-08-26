import { requireAdminPage } from "@/lib/page-guards";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireAdminPage("/admin/products/new");

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10 text-ink">Add Product</h1>
      <ProductForm />
    </div>
  );
}
