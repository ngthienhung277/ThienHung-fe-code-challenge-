interface WalletBalance {
    currency: string;
    amount: number;
    blockchain?: string;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps {
    children?: ReactNode;
    ...rest: any;
}

const PRIORITY_CONFIG = {
    'Osmosis': 100,
    'Ethereum': 50,
    'Arbitrum': 30,
    'Zilliqa': 20,
    'Neo': 20,
} as const;

const getPriority = (blockchain: string): number => PRIORITY_CONFIG[blockchain as keyof typeof PRIORITY_CONFIG] || -99;

const WalletPage: React.FC<Props> = ({ props: Props }) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() =>
        balances
            .filter((balance: WalletBalance) => getPriority(balance.blockchain || '') > -99 && balance.amount > 0)
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain || '');
                const rightPriority = getPriority(rhs.blockchain || '');
                return leftPriority > rightPriority ? -1 : rightPriority > leftPriority ? 1 : 0;
            }), [balances]);

    const formattedBalances = useMemo(() =>
        sortedBalances.map((balance: WalletBalance) => ({
            ...balance,
            formatted: balance.amount.toFixed(),
        })), [sortedBalances]);

    const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                className={`classes.row`}
                key={index}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });

    return (
        <div {...rest}>
            {rows}
        </div>
    );
};

export default WalletPage;