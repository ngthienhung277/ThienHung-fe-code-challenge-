import AmpLunaIcon from './assets/ampLUNA.svg';
import AtomIcon from './assets/atom.svg';
import AxlUsdcIcon from './assets/AxlUSDC.svg';
import BlurIcon from './assets/blur.svg';
import BneoIcon from './assets/bneo.svg';
import BusdIcon from './assets/busd.svg';
import EthIcon from './assets/eth.svg';
import EvmosIcon from './assets/evmos.svg';
import GmxIcon from './assets/gmx.svg';
import IbcxIcon from './assets/ibcx.svg';
import IrisIcon from './assets/iris.svg';
import KujiIcon from './assets/kuji.svg';
import LsiIcon from './assets/lsi.svg';
import LunaIcon from './assets/luna.svg';
import OkbIcon from './assets/okb.svg';
import OsmoIcon from './assets/osmo.svg';
import OktIcon from './assets/okt.svg';
import RAtomIcon from './assets/rATOM.svg';
import RswthIcon from './assets/rswth.svg';
import StEvmosIcon from './assets/stEVMOS.svg';
import StLunaIcon from './assets/stLUNA.svg';
import StOsmoIcon from './assets/stOSMO.svg';
import StatomIcon from './assets/statom.svg';
import StRdIcon from './assets/stRD.svg';
import SwthIcon from './assets/swth.svg';
import UscIcon from './assets/usc.svg';
import UsdcIcon from './assets/usdc.svg';
import UsdIcon from './assets/usd.svg';
import WbtcIcon from './assets/wbtc.svg';
import WstethIcon from './assets/wsteth.svg';
import YieldusdIcon from './assets/yieldusd.svg';
import ZilIcon from './assets/zil.svg';


const icons = {
    AMPLUNA: AmpLunaIcon,
    ATOM: AtomIcon,
    AXLUSDC: AxlUsdcIcon,
    BLUR: BlurIcon,
    BNEO: BneoIcon,
    BUSD: BusdIcon,
    ETH: EthIcon,
    EVMOS: EvmosIcon,
    GMX: GmxIcon,
    IBCX: IbcxIcon,
    IRIS: IrisIcon,
    KUJI: KujiIcon,
    LSI: LsiIcon,
    LUNA: LunaIcon,
    OKB: OkbIcon,
    OKT: OktIcon,
    OSMO: OsmoIcon,
    RATOM: RAtomIcon,
    RSWTH: RswthIcon,
    STATOM: StatomIcon,
    STEVMOS: StEvmosIcon,
    STLUNA: StLunaIcon,
    STOSMO: StOsmoIcon,
    STRD: StRdIcon,
    SWTH: SwthIcon,
    USC: UscIcon,
    USD: UsdIcon,
    USDC: UsdcIcon,
    WBTC: WbtcIcon,
    WSTETH: WstethIcon,
    YIELDUSD: YieldusdIcon,
    ZIL: ZilIcon,
};

const CurrencyIcon = ({ currency }) => {
    const key = currency.toUpperCase();
    const iconSrc = icons[key];
    return iconSrc ? (
        <img src={iconSrc} alt={currency} className="w-6 h-6" />
    ) : (
        <div className="w-6 h-6 bg-gray-400 rounded" />
    );
};

export default CurrencyIcon;
