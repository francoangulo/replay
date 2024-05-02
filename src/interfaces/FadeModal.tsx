export interface FadeModalState {
  autoDismiss: boolean;
  complexId?: string;
  status?: string;
  visible: boolean;
}

export type SetModalState = React.Dispatch<
  React.SetStateAction<FadeModalState>
>;
