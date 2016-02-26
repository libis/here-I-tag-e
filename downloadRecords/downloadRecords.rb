require 'active_support/all'
require 'europeana/api'
require 'geocoder'
require 'json'
require 'logger'

g='AIzaSyC3ntEatI6AaGfzLXamcuRCmC6BzE_R8Is'
logger = Logger.new(STDOUT)
Europeana::API.api_key = '8BsYggJzy'

e_query = 'foto stadsarchief leuven'


begin
  export_file = File.open('export.json', 'wb')
  search = Europeana::API.search(query: e_query, cursor:'*', rows: 100)
  records = search['items']
  record_count = search['totalResults']

  logger.info("Found #{record_count}")

  while next_cursor = search['nextCursor'] do
    records.each do |record|
      title = record['title'] if(record.has_key?('title'))
      logger.info(title.join(' - '))
      title_words = title.join("\n").downcase.split(' ')
      geo_words = title_words.select do |word|
        word =~ /plein|straat|lei|weg|toren|markt|huis|berg|kerk|laan/
      end

      geo_words.each do |g|
        lat_lon = Geocoder.coordinates("#{g}, leuven, belgium")
        if lat_lon.is_a?(Array)
          logger.info("\t#{g} = #{lat_lon.join(', ')}")
          record['lbsLatLon'] = lat_lon
        end
      end
      export_file.puts record.to_json
    end
    search = Europeana::API.search(query: e_query, cursor:next_cursor, rows: 100)
    records = search['items']
  end

rescue Exception => e
  logger.error("Search failed for: #{e_query}\n REASON: #{e.message}")
  puts e.backtrace.join("\n")
end



