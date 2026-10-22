import Link from 'next/link';
import { ArrowUpRight } from '@/components/icons';
export default function NotFound() { return <div className="container not-found"><div className="eyebrow" style={{justifyContent:'center'}}>404 / A DIFFERENT TURN</div><h1>Let’s get you back on track.</h1><p>This page is unavailable. Service-area pages only appear after coverage is verified.</p><Link href="/" className="button button-yellow">Back to the homepage<ArrowUpRight size={19}/></Link></div>; }
