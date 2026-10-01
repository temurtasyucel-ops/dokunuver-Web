import { getSiteContent } from "../../../lib/site-content-server";
import { ProductPage } from "../../components/storefront/Storefront";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "İlan NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER İlan NFC Kartı ile ilan bağlantınızı müşterilerinizle NFC veya QR üzerinden kolayca paylaşın.",
};
export default async function Page() { return <ProductPage content={await getSiteContent()} id="ilan" />; }
