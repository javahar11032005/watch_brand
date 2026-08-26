import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, listProducts } from "@/services/productService";
import ProductMediaViewer from "@/components/product/ProductMediaViewer";
import ProductBuyBox from "@/components/product/ProductBuyBox";
import DetailedSpecSection from "@/components/product/DetailedSpecSection";
import ProductStorySection from "@/components/product/ProductStorySection";
import RelatedWatches from "@/components/collection/RelatedWatches";
import { media, productVideoSrc } from "@/data/media";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return {};
  return {
    title: `${product.name} — Kestrel Watch Co.`,
    description: product.description,
  };
}

export default async function WatchPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0];

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-porcelain">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-28 md:mb-36">
          <ProductMediaViewer
            videoSrc={productVideoSrc(product.videoId, product.slug)}
            posterUrl={product.heroImageUrl}
            posterAlt={product.name}
            title={product.name}
          />
          <ProductBuyBox
            product={{
              id: product.id,
              name: product.name,
              description: product.description,
              basePrice: product.basePrice,
              currency: product.currency,
              movementType: product.movementType,
              caseDiameterMm: product.caseDiameterMm,
              waterResistanceAtm: product.waterResistanceAtm,
              variants: product.variants,
            }}
          />
        </div>
      </div>

      <DetailedSpecSection
        product={product}
        referenceVariant={{
          caseMaterial: defaultVariant.caseMaterial,
          dialColor: defaultVariant.dialColor,
          strapMaterial: defaultVariant.strapMaterial,
        }}
      />

      <ProductStorySection
        eyebrow="The Story"
        title={product.subtitle}
        story={product.story}
        imageUrl={media.macro.movement.url}
        imageAlt={media.macro.movement.alt}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-24 md:pt-32">
        <RelatedWatches collectionKey={product.collectionKey} excludeSlug={product.slug} />
      </div>
    </div>
  );
}
