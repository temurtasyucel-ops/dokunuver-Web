import { getSiteContent } from "../../../lib/site-content-server";
import { ProductPage } from "../../components/storefront/Storefront";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Instagram NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER Instagram NFC Kartı ile müşterilerinizi Instagram profilinize NFC veya QR üzerinden kolayca yönlendirin.",
};
export default async function Page() { return <ProductPage content={await getSiteContent()} id="instagram" />; }
