export class Helpers {
    static padLRNumber(lrNumber: any): string {
        return Helpers.padLeft(lrNumber, '0', 5);
    }

    static padLeft(lrNumber: number, padChar: string, size: number) {
        return (String(padChar).repeat(size) + lrNumber.toString()).substr((size * -1), size);
    }
}
