import { getSiteContent } from "../../../lib/site-content-server";
import { ProductPage } from "../../components/storefront/Storefront";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "IBAN NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER IBAN NFC Kartı ile banka, hesap sahibi ve IBAN bilgilerinizi NFC veya QR üzerinden kolayca paylaşın.",
};
export default async function Page() { return <ProductPage content={await getSiteContent()} id="iban" />; }
