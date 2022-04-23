import VerticalLayout from './VerticalLayout.js'
import euroIcon from '../assets/svg/euro.js'
import pctIcon from '../assets/svg/pct.js'

export default () => {

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="expense-type" class="bold-label">Type de dépense</label>
                      <select id="expense-type" required class="form-control blue-border" data-testid="expense-type">
                        <option>Transports</option>
                        <option>Restaurants et bars</option>
                        <option>Hôtel et logement</option>
                        <option>Services en ligne</option>
                        <option>IT et électronique</option>
                        <option>Equipement et matériel</option>
                        <option>Fournitures de bureau</option>
                      </select>
                  </div>
                  <div class="col-half">
                    <label for="expense-name" class="bold-label">Nom de la dépense</label>
                    <input id="expense-name" type="text" class="form-control blue-border" data-testid="expense-name" placeholder="Vol Paris Londres" />
                  </div>
                  <div class="col-half">
                    <label for="datepicker" class="bold-label">Date</label>
                    <input id="datepicker" required type="date" class="form-control blue-border" data-testid="datepicker" />
                  </div>
                  <div class="col-half">
                    <label for="amount" class="bold-label">Montant TTC </label>
                    <div class="d-flex align-items-center">
                    <input id="amount" required type="number" min="0" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                    <span class="newbill-form-icon"> ${euroIcon} </span>
                    </div>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col"> 
                      <label for="vat" class="bold-label">TVA</label>
                      <div class="d-flex align-items-center">
                        <input id="vat" type="number" min="0" class="form-control blue-border" data-testid="vat" placeholder="70" />
                        <span class="newbill-form-icon"> ${euroIcon} </span>
                      </div>
                    </div>
                    <div class="flex-col">
                      <label for="pct" class="bold-label">Taux</label>
                      <div class="d-flex align-items-center">
                        <input id="pct" required type="number" min="0" max="100" class="form-control blue-border" data-testid="pct" placeholder="20" />
                        <span class="newbill-form-icon"> ${pctIcon} </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="commentary" class="bold-label">Commentaire</label>
                    <textarea id="commentary" class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half">
                    <label for="file" class="bold-label" data-testid="label-file">Justificatif</label>
                    <input id="file" required type="file" class="form-control blue-border" data-testid="file" accept="image/jpg, image/jpeg, image/png" />
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}