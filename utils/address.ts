export default function formatAddress(address: string | undefined) {
  return address ? `${address.slice(0, 5)}…${address.slice(37, 42)}`: "";
}
