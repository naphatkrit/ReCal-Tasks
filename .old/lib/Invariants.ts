import assert = require("assert");

module Invariants
{
    type Invariant = ()=>boolean;
    let debug = Number(process.env.RECAL_DEBUG || "0") !== 0;
    export let alwaysTrue: Invariant = () => { return true; }
    export let alwaysFalse: Invariant = () => { return false; }
    export function check(invariant: Invariant)
    {
        if (debug) {
            assert(invariant());
        }
    }
    export function checkArray(invariants: Invariant[]) {
        let combined = invariants.reduce(chain, alwaysTrue);
        check(combined);
    }
    export function chain(invariant1: Invariant, invariant2: Invariant)
    {
        return () => { return invariant1() && invariant2(); }
    }
    export function notNullOrUndefined(item: any): Invariant {
        return ()=>{ return item !== null && item !== undefined; }
    }
}
export = Invariants;
