import { EventListener as NewTransactionLogFromMarketplace,updateNFTOwner } from '../generated/NFTMarketplace/NFTMarketplace'
import { EventListener as NewTransactionLogFromCollection ,createNFTOwner} from '../generated/NFTCollection/NFTCollection'
import { TransactionLog,NFT } from '../generated/schema'
import { bigInt } from '@graphprotocol/graph-ts'

export function handleNewEventFromNFTCollection(event: NewTransactionLogFromCollection): void {
  let transactionlog = new TransactionLog(event.params.id.toHex())
  transactionlog.from = event.params.from
  transactionlog.to = event.params.to
  transactionlog.ethPrice = event.params.ethPrice
  transactionlog.tokenId = event.params.tokenId
  transactionlog.created_at = bigInt.fromString(`${Date.now()}`)
  transactionlog.save()
}

export function handleNewEventFromNFTMarketplace(event: NewTransactionLogFromMarketplace): void {
  let transactionlog = new TransactionLog(event.params.id.toHex())
  transactionlog.from = event.params.from
  transactionlog.to = event.params.to
  transactionlog.ethPrice = event.params.ethPrice
  transactionlog.eventName = event.params.eventName
  transactionlog.tokenId = event.params.tokenId
  transactionlog.created_at = bigInt.fromString(`${Date.now()}`)
  transactionlog.save()
}

export function handleCreateNFTOwner(event: createNFTOwner): void {
  let nft = new NFT(`${event.params.tokenId}`)
  nft.owner = event.params.owner
}

export function handleUpdateNFTOwner(event: updateNFTOwner): void {
  let id = `${event.params.tokenId}`
  let nft = NFT.load(id)
  if (nft == null) {
    nft = new NFT(id)
  }
  nft.owner = event.params.owner
  nft.save()
}



