import { getSiteContent } from "../../../lib/site-content-server";
import { productMetadata } from "../../../lib/product-page";
import { ProductPage } from "../../components/storefront/Storefront";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) { return productMetadata((await params).id); }
export default async function Page({ params }) {
  return <ProductPage content={await getSiteContent()} id={(await params).id} />;
}
