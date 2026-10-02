import PaymentCard from '../components/PaymentCard';
export default function IbanDemo() {
  return <PaymentCard demo card={{ business_name: 'Örnek İşletme', bank_name: 'Demo Bankası', account_holder: 'Örnek Hesap Sahibi', iban: 'TR00 0000 0000 0000 0000 0000 00' }} />;
}
