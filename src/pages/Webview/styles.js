import styled from 'styled-components/native';

export const LoadingIcon = styled.ActivityIndicator.attrs({
  color: '#7159c1',
})`
  /** better than flex in this case, because this icon overlays the
      webview and gets centered even when the display is rotated */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
