export function getSharedWithDbPK(sharedUserId: string) {
  return `SHAREDWITH#${sharedUserId}`;
}

export function getTagDbPK(tag: string, isPublic: boolean) {
  if (tag === 'PUBLIC') {
      return `TAG#PUBLIC`;
  }
  return isPublic ? `TAG#PUBLIC#${tag}` : `TAG#PRIVATE#${tag}`;
}

export function getOwnerWithDbPK(userId: string) {
  return `CREATEDBY#${userId}`;
}