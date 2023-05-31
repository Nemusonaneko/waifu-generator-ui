export default function formatAddress(address: string | undefined) {
  return address ? `${address.slice(0, 3)}…${address.slice(39, 42)}`: "";
}
