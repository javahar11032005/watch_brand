import Link from "next/link";
import { requireAdminPage } from "@/lib/page-guards";
import { listAllProductsForAdmin } from "@/services/productService";
import { formatPrice } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  await requireAdminPage("/admin/products");

  const products = await listAllProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl text-ink">Products</h1>
        <LinkButton href="/admin/products/new">Add Product</LinkButton>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-taupe text-left text-xs tracking-[0.15em] uppercase text-slate">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Base Price</th>
              <th className="py-3 pr-4">Variants</th>
              <th className="py-3 pr-4">Total Stock</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe">
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={product.id}>
                  <td className="py-4 pr-4">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-ink hover:text-brass transition-colors focus-ring">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-ink">{formatPrice(product.basePrice, product.currency)}</td>
                  <td className="py-4 pr-4 text-ink">{product.variants.length}</td>
                  <td className="py-4 pr-4 text-ink">{totalStock}</td>
                  <td className="py-4 pr-4 text-ink">{product.isActive ? "Active" : "Hidden"}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs tracking-[0.15em] uppercase text-ink/70 hover:text-brass transition-colors focus-ring"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
