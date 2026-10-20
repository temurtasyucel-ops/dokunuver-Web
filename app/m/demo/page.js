import Portal from '../../menu-components/Portal';
import {demoMenu} from '../../menu-components/demo.mjs';
export const metadata={title:'Menü portalı önizleme',robots:{index:false,follow:false}};
export default function Page(){return <Portal document={demoMenu} demo/>;}
