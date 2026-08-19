import type { UIMessageStreamWriter } from 'ai';
import { saveLeadDetails } from './saveLeadDetails';
import { trackShipment } from './trackShipment';
import { handoffToExpert } from './handoffToExpert';
import { answerOpenItem } from './answerOpenItem';
import { analyzeProductPhoto } from './analyzeProductPhoto';
import { notePhotoDeclined } from './notePhotoDeclined';

/**
 * Build the toolset for one turn.
 *
 * conversationId and requestRef are bound here, server-side, and never appear in
 * any tool's input schema — if the model could name the conversation it was
 * writing to, it could be talked into writing to someone else's.
 */
export function buildTools({
  conversationId,
  requestRef,
  writer,
}: {
  conversationId: string;
  requestRef: string | null;
  writer: UIMessageStreamWriter;
}) {
  return {
    saveLeadDetails: saveLeadDetails(conversationId),
    analyzeProductPhoto: analyzeProductPhoto(conversationId, writer),
    notePhotoDeclined: notePhotoDeclined(conversationId),
    trackShipment: trackShipment(writer),
    ...(requestRef
      ? // Only offered once a request exists: answering questions is for the
        // waiting phase, and handing off twice is meaningless.
        { answerOpenItem: answerOpenItem(requestRef) }
      : { handoffToExpert: handoffToExpert(conversationId, writer) }),
  };
}
