import Reveal from "@/components/ui/Reveal";
import { labelCaseMaterial, labelDialColor, labelStrapMaterial } from "@/lib/format";

type Product = {
  caseDiameterMm: number;
  caseThicknessMm: number;
  caseFinish: string;
  waterResistanceAtm: number;
  dialFinish: string;
  hourMarkers: string;
  handsType: string;
  movementType: string;
  calibre: string;
  powerReserveHours: number;
  frequencyHz: number;
  jewelCount: number;
  strapClasp: string;
  strapFinish: string;
  complications: string[];
};

type ReferenceVariant = {
  caseMaterial: "STEEL" | "TITANIUM" | "ROSE_GOLD";
  dialColor: "IVORY" | "MIDNIGHT" | "SILVER";
  strapMaterial: "LEATHER" | "STEEL_BRACELET" | "RUBBER";
};

function Group({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div>
      <p className="text-xs tracking-[0.25em] uppercase text-brass mb-4">{title}</p>
      <dl className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6 text-sm">
            <dt className="text-slate">{label}</dt>
            <dd className="text-ink text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function DetailedSpecSection({
  product,
  referenceVariant,
}: {
  product: Product;
  referenceVariant: ReferenceVariant;
}) {
  const functions = ["Hours", "Minutes", "Seconds", ...product.complications];

  return (
    <section className="py-24 md:py-32 bg-porcelain-2 border-y border-taupe">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="max-w-xl mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Specification</p>
          <h2 className="font-serif text-3xl md:text-4xl text-balance text-ink">
            Every detail, considered.
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          <Group
            title="Case"
            rows={[
              ["Material", labelCaseMaterial(referenceVariant.caseMaterial)],
              ["Diameter", `${product.caseDiameterMm} mm`],
              ["Thickness", `${product.caseThicknessMm} mm`],
              ["Finish", product.caseFinish],
              ["Water Resistance", `${product.waterResistanceAtm * 10} m (${product.waterResistanceAtm} ATM)`],
            ]}
          />
          <Group
            title="Dial"
            rows={[
              ["Color", labelDialColor(referenceVariant.dialColor)],
              ["Finish", product.dialFinish],
              ["Hour Markers", product.hourMarkers],
              ["Hands", product.handsType],
            ]}
          />
          <Group
            title="Movement"
            rows={[
              ["Type", product.movementType],
              ["Calibre", product.calibre],
              ["Power Reserve", `${product.powerReserveHours} hours`],
              ["Frequency", `${product.frequencyHz * 7200} vph`],
              ["Jewels", `${product.jewelCount}`],
            ]}
          />
          <Group
            title="Crystal"
            rows={[
              ["Material", "Sapphire Crystal"],
              ["Coating", "Anti-Reflective, Both Faces"],
            ]}
          />
          <Group
            title="Strap / Bracelet"
            rows={[
              ["Material", labelStrapMaterial(referenceVariant.strapMaterial)],
              ["Clasp / Buckle", product.strapClasp],
              ["Finish", product.strapFinish],
            ]}
          />
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-brass mb-4">Functions</p>
            <ul className="flex flex-wrap gap-2">
              {functions.map((fn) => (
                <li
                  key={fn}
                  className="text-xs tracking-[0.1em] uppercase text-ink border border-taupe px-3 py-1.5"
                >
                  {fn}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
