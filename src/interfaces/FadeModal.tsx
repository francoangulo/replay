export interface FadeModalState {
  visible: boolean;
  status?: string;
  complexId?: string;
  autoDismiss: boolean;
}

export type SetModalState = React.Dispatch<
  React.SetStateAction<FadeModalState>
>;
