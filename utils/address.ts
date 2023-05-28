export default function formatAddress(address: string | undefined) {
  return address ? `${address.slice(0, 6)}…${address.slice(38, 42)}`: "";
}
