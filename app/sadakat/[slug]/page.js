import Customer from '../Customer';
export default async function Page({params}){const {slug}=await params;return <Customer slug={slug}/>;}
