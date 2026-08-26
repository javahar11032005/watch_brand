export type CartIdentity =
  | { kind: "user"; userId: string }
  | { kind: "guest"; guestToken: string };

export type CartWithDetails = Awaited<
  ReturnType<typeof import("@/services/cartService").getCart>
>;
