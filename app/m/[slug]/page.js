import Portal from '../../menu-components/Portal';
import {getPublicMenu} from '../../../lib/menu-public.mjs';
export const dynamic='force-dynamic';
export const metadata={title:'İşletme menüsü | DOKUNUVER'};
export default async function Page({params}){const {slug}=await params;let data;try{data=await getPublicMenu(slug);}catch{return <Portal/>;}return <Portal document={data?.document} slug={slug}/>;}
