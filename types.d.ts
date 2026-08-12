declare module "framer" {
  export const ControlType: {
    String: string
    Number: string
    Color: string
    Boolean: string
    Enum: string
    Array: string
    Object: string
    File: string
    Image: string
    ComponentInstance: string
  }
  export function addPropertyControls(component: unknown, controls: unknown): void
}
