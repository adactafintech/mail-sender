export interface ExternalMessage<T> {
    command: string;
    data?: T;
    errorMessage?: string;
}